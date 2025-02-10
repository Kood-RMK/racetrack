'use client'


import {Button, Disclosure, DisclosureGroup, DisclosurePanel, DisclosureProps, Heading, Label, ListBox, ListBoxItem, Popover, Select, SelectValue} from 'react-aria-components';
import React, { Key, ReactNode } from 'react';
import Icon from '@mdi/react';
import { mdiChevronDown, mdiChevronUp, mdiDivingScubaFlag, mdiOfficeBuildingCog, mdiOfficeBuildingCogOutline } from '@mdi/js';

interface SidebarDisclosureProps extends Omit<DisclosureProps, 'children'> {
  title: string,
  iconPath : string,
  items : ReactNode[]
  children?: React.ReactNode
}

interface SidebarItemProps {
  title: string,
  path : string
}

function SidebarItem({title, path} : SidebarItemProps) {

  return (
      <Button slot="trigger" className="flex">
        <span>{title}</span>
      </Button>
  )
}

function SidebarDisclosure({title, iconPath, items, children, ...props}: SidebarDisclosureProps) {
  let [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Disclosure  
    isExpanded={isExpanded} 
    onExpandedChange={setIsExpanded}
    defaultExpanded={false}
    className="text-white w-64 flex flex-col items-center font-cairo text-lg font-medium"
    {...props}
    >
      <Button slot="trigger" className="flex flex-row w-full items-center justify-between bg-secondary rounded-lg py-2 px-2 mb-3">
        <div className="flex align-middle items-center">
          <Icon className="w-7 min-w-7 h-auto" path={iconPath} />
          <span className="ml-3">
            {title}
          </span>
        </div>
        <Icon className="w-7 min-w-7 h-auto" path={ isExpanded ?  mdiChevronUp : mdiChevronDown } />
      </Button>
      <DisclosurePanel className="w-full">
        <ul className="w-full flex flex-col pl-12 gap-1">
          {items.map((item, index) => (
            //Generally using index as a key is dangerous, but this is fine. 
            //https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js
            <li key={index} className="text-left">
              {item}
            </li>
          ))}
        </ul>
      </DisclosurePanel>
    </Disclosure>
  )
}


export default function Sidebar() {
  return (
    <>
    <nav className='w-72 bg-primary h-screen'>
      <DisclosureGroup allowsMultipleExpanded className="h-full w-full flex flex-col gap-4 items-center">
        <SidebarDisclosure 
        id="system" 
        title="Front Desk" 
        iconPath={mdiOfficeBuildingCog} 
        items={[
          <SidebarItem title="Race Control" path="/admin/race-control"/>,
          <SidebarItem title="Lap-line Observer" path="/admin/race-control"/>,
          <SidebarItem title="Flag Bearer" path="/admin/race-control"/>
        ]}>
        </SidebarDisclosure>
        <SidebarDisclosure 
        id="system2" 
        title="Race Display" 
        iconPath={mdiDivingScubaFlag} 
        items={[
          <SidebarItem title="Race Control" path="/admin/race-control"/>,
          <SidebarItem title="Lap-line Observer" path="/admin/race-control"/>,
          <SidebarItem title="Flag Bearer" path="/admin/race-control"/>
        ]}>
          Details about system requirements here
        </SidebarDisclosure>
      </DisclosureGroup>
    </nav>
    </>
  );
}