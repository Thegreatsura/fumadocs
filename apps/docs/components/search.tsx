'use client';

import { OramaClient } from '@oramacloud/client';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogListItem,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import { ChevronDown, FileText, Hash, TextIcon } from 'lucide-react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { cn } from '@/lib/cn';

const client = new OramaClient({
  endpoint: 'https://cloud.orama.run/v1/indexes/docs-fk97oe',
  api_key: 'oPZjdlFbq5BpR54bV5Vj57RYt83Xosk7',
});

const icons = {
  text: <TextIcon className="size-4 shrink-0 text-fd-muted-foreground" />,
  heading: <Hash className="size-4 shrink-0 text-fd-muted-foreground" />,
  page: (
    <FileText
      fill="currentColor"
      stroke="var(--color-fd-muted)"
      className="size-6 bg-fd-muted p-0.5 rounded-sm border border-fd-foreground/30 shadow-sm shrink-0"
    />
  ),
};

const items = [
  {
    name: 'All',
    value: undefined,
  },
  {
    name: 'Framework',
    description: 'Only results about Fumadocs UI & guides',
    value: 'ui',
  },
  {
    name: 'Core',
    description: 'Only results about headless features',
    value: 'headless',
  },
  {
    name: 'MDX',
    description: 'Only results about Fumadocs MDX',
    value: 'mdx',
  },
  {
    name: 'CLI',
    description: 'Only results about Fumadocs CLI',
    value: 'cli',
  },
];

export default function CustomSearchDialog(props: SharedProps) {
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState<string | undefined>();
  const { search, setSearch, query } = useDocsSearch({
    type: 'orama-cloud',
    client,
    tag,
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList
          items={query.data !== 'empty' ? query.data : null}
          Item={({ item, onClick }) => (
            <SearchDialogListItem item={item} onClick={onClick}>
              {item.type !== 'page' && (
                <div
                  role="none"
                  className="absolute start-5.5 inset-y-0 w-px bg-fd-border"
                />
              )}
              {icons[item.type]}

              {item.type === 'page' ? (
                <p className="min-w-0 truncate font-medium">{item.content}</p>
              ) : (
                <p className="min-w-0 truncate">{item.content}</p>
              )}
            </SearchDialogListItem>
          )}
        />
        <SearchDialogFooter className="flex flex-row flex-wrap gap-2 items-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className={buttonVariants({
                size: 'sm',
                color: 'ghost',
                className: '-m-1.5 me-auto',
              })}
            >
              <span className="text-fd-muted-foreground/80 me-2">Filter</span>
              {items.find((item) => item.value === tag)?.name}
              <ChevronDown className="size-3.5 text-fd-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col p-1 gap-1" align="start">
              {items.map((item, i) => {
                const isSelected = item.value === tag;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setTag(item.value);
                      setOpen(false);
                    }}
                    className={cn(
                      'rounded-lg text-start px-2 py-1.5',
                      isSelected
                        ? 'text-fd-primary bg-fd-primary/10'
                        : 'hover:text-fd-accent-foreground hover:bg-fd-accent',
                    )}
                  >
                    <p className="font-medium mb-0.5">{item.name}</p>
                    <p className="text-xs opacity-70">{item.description}</p>
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
          <a
            href="https://orama.com"
            rel="noreferrer noopener"
            className="text-xs text-nowrap text-fd-muted-foreground"
          >
            Powered by Orama
          </a>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
