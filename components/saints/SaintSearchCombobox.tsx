'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronsUpDown } from 'lucide-react';
import type { SaintPick } from '@/lib/saints/saints-queries';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Props = {
  saints: SaintPick[];
  disabled?: boolean;
};

export function SaintSearchCombobox({ saints, disabled }: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || saints.length === 0}
          className="h-11 w-full max-w-xl justify-between border-white/15 bg-brown-dark/40 font-normal text-left text-muted-foreground hover:bg-brown-dark/55 hover:text-foreground"
        >
          Search by name…
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-w-xl border-mustard/20 p-0" align="start">
        <Command
          filter={(value, search) =>
            value.toLowerCase().includes(search.trim().toLowerCase()) ? 1 : 0
          }
        >
          <CommandInput placeholder="Type a saint's name…" />
          <CommandList>
            <CommandEmpty>No saint found.</CommandEmpty>
            <CommandGroup>
              {saints.map((s) => (
                <CommandItem
                  key={s.id}
                  value={`${s.name} ${s.slug.replace(/-/g, ' ')}`}
                  keywords={[s.name, s.slug]}
                  onSelect={() => {
                    router.push(`/saints/${s.slug}`);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {s.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
