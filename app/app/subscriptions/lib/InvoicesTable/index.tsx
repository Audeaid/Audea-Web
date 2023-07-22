'use client';

import Stripe from 'stripe';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DownloadCloud } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { subscriptionPrices } from '@/app/data/subscriptionPrices';
import cn from '@/utils/cn';

export default function InvoicesTable({
  invoices,
}: {
  invoices: Stripe.Invoice[];
}) {
  return (
    <Table className={cn('z-10')}>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Download</TableHead>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>
              <a href={invoice.hosted_invoice_url ?? ''} target="_blank">
                <DownloadCloud />
              </a>
            </TableCell>
            <TableCell>{invoice.number}</TableCell>
            <TableCell>
              {invoice.status === 'paid' ? (
                <Badge>{invoice.status}</Badge>
              ) : (
                <Badge variant="destructive">{invoice.status}</Badge>
              )}
            </TableCell>
            <TableCell>
              {
                subscriptionPrices.find(
                  (v) => v.id === invoice.lines.data[0].price?.id
                )?.displayNameInvoice
              }
            </TableCell>
            <TableCell className="text-right">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(invoice.total / 100)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
