import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from 'lucide-react';
import { Separator } from '../ui/separator';

export default function ErrorToast(action: string, error: any) {
  const e = JSON.stringify(error, null, 2);

  console.error(JSON.parse(e));

  return toast(
    (t) => (
      <div className="flex flex-col items-center justify-center w-full gap-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <p>
            <FontAwesomeIcon
              icon={faXmarkCircle}
              className="text-destructive mr-2"
              size="lg"
            />
            There&apos;s an error occurred doing action:{' '}
            <strong className="font-bold">{action}</strong>
          </p>
          <Separator />
        </div>

        <p className="text-justify">
          We have not yet notified about this. Please report an issue and we
          will fix this ASAP!
        </p>

        <div className="grid grid-cols-[1fr_0.4fr] gap-4">
          <Button
            onClick={async () => {
              await navigator.clipboard.writeText(e);
              toast.dismiss(t.id);
            }}
            size={'default'}
            variant={'outline'}
          >
            <Clipboard className="mr-2 h-4 w-4" /> Copy error message
          </Button>
          <Button
            onClick={() => toast.dismiss(t.id)}
            size={'default'}
            variant={'destructive'}
          >
            Dismiss
          </Button>
        </div>
      </div>
    ),
    { duration: Infinity, position: 'top-center' }
  );
}
