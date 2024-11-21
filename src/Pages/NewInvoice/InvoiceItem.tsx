import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash } from 'lucide-react'
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { IInvoiceItem } from '@/lib/types';

interface InvoiceItemInterface {
  removeItem: (arg0: number) => void;
  index: number;
  item: IInvoiceItem;
}

const InvoiceItem = ({ removeItem, index, item: invoiceItem }: InvoiceItemInterface) => {
  const [item, setItem] = React.useState<IInvoiceItem>(invoiceItem);
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const name = evt.target.name;
    const value = evt.target.value;
    setItem(prevState => ({
      ...prevState,
      [name]: name === 'quantity' ? Number(value) : value
    }));
  }

  console.log(item);

  return (
    <TableRow className="">
      <TableCell className="">
        <Input defaultValue={invoiceItem.description} onChange={handleChange} name="description" value={item.description} className='border-none' placeholder='Item description' />
      </TableCell>
      <TableCell className="">
        <Input value={Number(item.quantity)} className='text-center border-none' onChange={handleChange} type="number" name="quantity" max="99999" />
      </TableCell>
      <TableCell className="">
        <Input onChange={handleChange} name="rate" value={item.rate} className='text-right border-none' />
      </TableCell>
      {/* <TableCell className="">
        <Input onChange={handleChange} name="tax" value={item.tax} className='text-right border-none' />
      </TableCell> */}
      <TableCell className="">
        <Input value={(item.quantity * item.rate).toLocaleString()} className='text-right border-none' disabled />
      </TableCell>
      <TableCell className="">
        <Button variant="destructive" onClick={() => removeItem(index)}>
          <Trash />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default InvoiceItem;
