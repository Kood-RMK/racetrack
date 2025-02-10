'use client'


import {Button, Disclosure, DisclosureGroup, DisclosurePanel, DisclosureProps, Heading, Label, ListBox, ListBoxItem, Popover, Select, SelectValue} from 'react-aria-components';
import React, { Key } from 'react';

interface SidebarDisclosureProps extends Omit<DisclosureProps, 'children'> {
  title?: string,
  children?: React.ReactNode
}

function SidebarDisclosure({title, children, ...props}: SidebarDisclosureProps) {
  return (
    <Disclosure {...props}>
      <Heading>
        <Button slot="trigger">
          <svg viewBox="0 0 24 24">
            <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          {title}
        </Button>
      </Heading>
      <DisclosurePanel>
        <p>{children}</p>
      </DisclosurePanel>
    </Disclosure>
  )
}


export default function Sidebar() {
  return (
    <>
    <DisclosureGroup defaultExpandedKeys={["system"]}>
      <SidebarDisclosure id="system" title="System Requirements" >
        Details about system requirements here
      </SidebarDisclosure>
    </DisclosureGroup>
    </>
  );
}