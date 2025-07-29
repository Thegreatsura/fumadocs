import type { PageTree } from 'fumadocs-core/server';
import {
  type ComponentProps,
  type HTMLAttributes,
  type ReactNode,
  useMemo,
} from 'react';
import { Languages, Sidebar as SidebarIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { buttonVariants } from '@/components/ui/button';
import {
  Sidebar,
  SidebarCollapseTrigger,
  SidebarContent,
  SidebarContentMobile,
  SidebarFooter,
  SidebarHeader,
  SidebarPageTree,
  SidebarViewport,
} from '@/components/layout/sidebar';
import {
  BaseLinkItem,
  type IconItemType,
  type LinkItemType,
} from '@/layouts/links';
import { RootToggle } from '@/components/layout/root-toggle';
import { type BaseLayoutProps, getLinks } from './shared';
import {
  LanguageToggle,
  LanguageToggleText,
} from '@/components/layout/language-toggle';
import {
  CollapsibleControl,
  LayoutBody,
  Navbar,
  NavbarSidebarTrigger,
} from '@/layouts/docs-client';
import { TreeContextProvider } from '@/contexts/tree';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import {
  getSidebarTabsFromOptions,
  SidebarLinkItem,
  type SidebarOptions,
} from '@/layouts/docs/shared';
import { NavProvider } from '@/contexts/layout';
import Link from 'fumadocs-core/link';
import {
  LargeSearchToggle,
  SearchToggle,
} from '@/components/layout/search-toggle';
import { HideIfEmpty } from 'fumadocs-core/hide-if-empty';

export interface DocsLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root;

  sidebar?: SidebarOptions &
    ComponentProps<'aside'> & {
      enabled?: boolean;
      component?: ReactNode;
    };

  /**
   * Props for the `div` container
   */
  containerProps?: HTMLAttributes<HTMLDivElement>;
}

export function DocsLayout({
  nav: { transparentMode, ...nav } = {},
  sidebar: {
    tabs: sidebarTabs,
    enabled: sidebarEnabled = true,
    ...sidebarProps
  } = {},
  searchToggle = {},
  disableThemeSwitch = false,
  themeSwitch = { enabled: !disableThemeSwitch },
  i18n = false,
  children,
  ...props
}: DocsLayoutProps) {
  const tabs = useMemo(
    () => getSidebarTabsFromOptions(sidebarTabs, props.tree) ?? [],
    [sidebarTabs, props.tree],
  );
  const links = getLinks(props.links ?? [], props.githubUrl);

  const variables = cn(
    sidebarEnabled &&
      'md:[--fd-sidebar-width:268px] lg:[--fd-sidebar-width:286px]',
    'xl:[--fd-toc-width:286px]',
    !nav.component && nav.enabled !== false
      ? '[--fd-nav-height:56px] md:[--fd-nav-height:0px]'
      : undefined,
  );

  function sidebar() {
    const {
      footer,
      banner,
      collapsible = true,
      component,
      components,
      defaultOpenLevel,
      prefetch,
      ...rest
    } = sidebarProps;
    if (component) return component;

    const iconLinks = links.filter(
      (item): item is IconItemType => item.type === 'icon',
    );

    const viewport = (
      <SidebarViewport>
        {links
          .filter((v) => v.type !== 'icon')
          .map((item, i, list) => (
            <SidebarLinkItem
              key={i}
              item={item}
              className={cn(i === list.length - 1 && 'mb-4')}
            />
          ))}
        <SidebarPageTree components={components} />
      </SidebarViewport>
    );

    const mobile = (
      <SidebarContentMobile {...rest}>
        <HideIfEmpty as={SidebarHeader}>
          <div className="flex items-center justify-end gap-2 px-0.5 empty:hidden">
            <IconItemList items={iconLinks} />
            {i18n ? (
              <LanguageToggle className="me-1.5">
                <Languages className="size-4.5" />
                <LanguageToggleText />
              </LanguageToggle>
            ) : null}
            {themeSwitch.enabled !== false &&
              (themeSwitch.component ?? (
                <ThemeToggle className="p-0" mode={themeSwitch.mode} />
              ))}
            <NavbarSidebarTrigger className="text-fd-muted-foreground" />
          </div>
          {tabs.length > 0 && <RootToggle options={tabs} />}
          {banner}
        </HideIfEmpty>
        {viewport}
        <SidebarFooter className="empty:hidden">{footer}</SidebarFooter>
      </SidebarContentMobile>
    );

    const content = (
      <SidebarContent {...rest}>
        <HideIfEmpty as={SidebarHeader}>
          <div className="flex">
            <Link
              href={nav.url ?? '/'}
              className="inline-flex text-[15px] items-center gap-2.5 font-medium me-auto"
            >
              {nav.title}
            </Link>
            {nav.children}
            {collapsible && (
              <SidebarCollapseTrigger
                className={cn(
                  buttonVariants({
                    color: 'ghost',
                    size: 'icon-sm',
                    className: 'mb-auto text-fd-muted-foreground',
                  }),
                )}
              >
                <SidebarIcon />
              </SidebarCollapseTrigger>
            )}
          </div>
          {searchToggle.enabled !== false &&
            (searchToggle.components?.lg ?? (
              <LargeSearchToggle hideIfDisabled />
            ))}
          {tabs.length > 0 && <RootToggle options={tabs} />}

          {banner}
        </HideIfEmpty>
        {viewport}
        <HideIfEmpty as={SidebarFooter}>
          <div className="flex items-center justify-end empty:hidden">
            <IconItemList items={iconLinks} />
            {i18n ? (
              <LanguageToggle className="me-1.5">
                <Languages className="size-4.5" />
              </LanguageToggle>
            ) : null}
            {themeSwitch.enabled !== false &&
              (themeSwitch.component ?? (
                <ThemeToggle className="p-0" mode={themeSwitch.mode} />
              ))}
          </div>
          {footer}
        </HideIfEmpty>
      </SidebarContent>
    );

    return (
      <Sidebar
        defaultOpenLevel={defaultOpenLevel}
        prefetch={prefetch}
        Mobile={mobile}
        Content={
          <>
            {collapsible && <CollapsibleControl />}
            {content}
          </>
        }
      />
    );
  }

  return (
    <TreeContextProvider tree={props.tree}>
      <NavProvider transparentMode={transparentMode}>
        {nav.enabled !== false &&
          (nav.component ?? (
            <Navbar className="h-14 md:hidden">
              <Link
                href={nav.url ?? '/'}
                className="inline-flex items-center gap-2.5 font-semibold"
              >
                {nav.title}
              </Link>
              <div className="flex-1">{nav.children}</div>
              {searchToggle.enabled !== false &&
                (searchToggle.components?.sm ?? (
                  <SearchToggle className="p-2" hideIfDisabled />
                ))}
              {sidebarEnabled && (
                <NavbarSidebarTrigger className="p-2 -me-1.5 md:hidden" />
              )}
            </Navbar>
          ))}
        <LayoutBody
          {...props.containerProps}
          className={cn(variables, props.containerProps?.className)}
        >
          {sidebarEnabled && sidebar()}
          {children}
        </LayoutBody>
      </NavProvider>
    </TreeContextProvider>
  );
}

function IconItemList({ items }: { items: IconItemType[] }) {
  return items.map((item, i) => (
    <BaseLinkItem
      key={i}
      item={item}
      className={cn(
        buttonVariants({ size: 'icon', color: 'ghost' }),
        'text-fd-muted-foreground [&_svg]:size-4.5',
        i === items.length - 1 && 'me-auto',
      )}
      aria-label={item.label}
    >
      {item.icon}
    </BaseLinkItem>
  ));
}

export { CollapsibleControl, Navbar, NavbarSidebarTrigger, type LinkItemType };
