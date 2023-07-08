'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import NotionImage from '../images/Notion.png';
import cn from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { IGetNotionAccount } from '../../graphql';
import ErrorToast from '@/components/ErrorToast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  seeAllNotionDatabase,
  ISeeAllNotionDatabase,
  setNotionPrimaryDatabase,
  deleteNotionConnection,
} from '../../[...connections]/lib/Notion/script';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { StickyNote, ArrowUpRightFromCircle, ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Notion({
  token,
  getNotionAccount,
}: {
  token: string;
  getNotionAccount: IGetNotionAccount | null;
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notionDatabase, setNotionDatabase] = useState<
    ISeeAllNotionDatabase[] | null
  >(null);

  const [automaticChecked, setAutomaticChecked] = useState(
    getNotionAccount ? getNotionAccount.automaticPost : false
  );

  useEffect(() => {
    (async () => {
      if (getNotionAccount !== null) {
        try {
          setLoading(true);

          const response = await seeAllNotionDatabase(token);
          setNotionDatabase(response);

          setLoading(false);
        } catch (error) {
          console.error(error);

          setLoading(false);

          ErrorToast('search all allowed notion database', error);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className={cn('flex items-center justify-between')}>
            <div className="flex items-center gap-4">
              <Image
                src={NotionImage}
                quality={100}
                draggable={false}
                height={40}
                width={40}
                alt="Notion logo"
              />
              Notion
            </div>

            {getNotionAccount === null ? (
              <Button type="button">
                <a
                  href={
                    process.env.NEXT_PUBLIC_NOTION_MAIN_OAUTH_AUTHORIZATION_URL!
                  }
                >
                  Connect
                </a>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button>
                    Manage connection <ChevronDown className="ml-2 w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                    Change Notion settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      toast
                        .promise(deleteNotionConnection(token), {
                          loading: 'Deleting your notion connection...',
                          success: 'Notion account deleted!',
                          error: 'Error deleting your notion connection!',
                        })
                        .then(() => {
                          router.push('/app/integrations');
                        })
                        .catch((e) => {
                          ErrorToast('deleting your notion connection', e);
                        });
                    }}
                  >
                    Delete connection
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      {getNotionAccount !== null && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage your Notion connection</DialogTitle>
              <DialogDescription>
                You can select your primary database in which Audea will post
                your note to.
              </DialogDescription>
            </DialogHeader>

            <section>
              <section className="flex flex-col gap-2 mb-8">
                <p>Workspace:</p>
                <section className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={getNotionAccount.workspaceIcon ?? undefined}
                    />
                    <AvatarFallback>
                      {getNotionAccount.workspaceName[0]}
                    </AvatarFallback>
                  </Avatar>

                  <p>{getNotionAccount.workspaceName}</p>
                </section>
              </section>

              {(() => {
                if (notionDatabase) {
                  if (loading) {
                    return <LoadingSpinner size={4} />;
                  } else {
                    return (
                      <form
                        className="space-y-8"
                        onSubmit={(e) => {
                          e.preventDefault();

                          const formData = new FormData(e.currentTarget);
                          const databaseForm = formData.get('database');
                          const automaticForm = formData.get('automatic');

                          if (!databaseForm) return;

                          const automatic = (() => {
                            if (automaticForm) {
                              if (automaticForm.toString() === 'on') {
                                return true;
                              } else {
                                return false;
                              }
                            } else {
                              return false;
                            }
                          })();

                          toast
                            .promise(
                              setNotionPrimaryDatabase(
                                token,
                                databaseForm.toString(),
                                automatic
                              ),
                              {
                                loading: 'Saving your notion settings...',
                                success: 'Your Notion settings saved!',
                                error: 'Error saving your Notion settings!',
                              }
                            )
                            .catch((e) => {
                              ErrorToast('saving your notion settings', e);
                            });
                        }}
                      >
                        <ScrollArea className="h-[250px] w-full overflow-scroll">
                          <RadioGroup
                            required={true}
                            name="database"
                            className={cn('space-y-2')}
                            defaultValue={
                              getNotionAccount.primaryDatabase ?? undefined
                            }
                          >
                            {notionDatabase.map((v, i) => {
                              return (
                                <div
                                  className="flex items-center space-x-2"
                                  key={i}
                                >
                                  <RadioGroupItem value={v.id} id={`r${i}`} />

                                  <Label
                                    htmlFor={`r${i}`}
                                    className="space-x-2 flex items-center"
                                  >
                                    {v.icon ? (
                                      <Image
                                        src={v.icon}
                                        alt={''}
                                        width={20}
                                        height={20}
                                        draggable={false}
                                      />
                                    ) : (
                                      <StickyNote className="w-4 h-4" />
                                    )}
                                    <span>{v.title}</span>
                                  </Label>
                                  {v.url && (
                                    <a href={v.url}>
                                      <ArrowUpRightFromCircle className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              );
                            })}
                          </RadioGroup>
                        </ScrollArea>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="automatic"
                            name="automatic"
                            checked={automaticChecked}
                            onCheckedChange={(v) => {
                              if (v) {
                                setAutomaticChecked(true);
                              } else {
                                setAutomaticChecked(false);
                              }
                            }}
                          />
                          <label
                            htmlFor="automatic"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Automatically post new note to Notion
                          </label>
                        </div>

                        <Button type="submit" className={cn('w-full')}>
                          Save settings
                        </Button>
                      </form>
                    );
                  }
                } else {
                  if (loading) {
                    return <LoadingSpinner size={4} />;
                  } else {
                    return (
                      <section className="space-y-4">
                        <p>
                          Didn&apos;t see your database here? Make sure that you
                          allowed Audea to post to your Notion database (not
                          your Notion page).
                        </p>

                        <p>
                          Please delete your Notion connection and try again.
                        </p>

                        <Button
                          variant="destructive"
                          className={cn('w-full')}
                          type="button"
                          onClick={() => {
                            toast
                              .promise(deleteNotionConnection(token), {
                                loading: 'Deleting your notion connection...',
                                success: 'Notion account deleted!',
                                error: 'Error deleting your notion connection!',
                              })
                              .catch((e) => {
                                ErrorToast(
                                  'deleting your notion connection',
                                  e
                                );
                              });
                          }}
                        >
                          Delete your Notion connection
                        </Button>
                      </section>
                    );
                  }
                }
              })()}
            </section>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
