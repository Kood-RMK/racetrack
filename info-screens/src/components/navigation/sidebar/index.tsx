'use client'


import {Button, Disclosure, DisclosureGroup, DisclosurePanel, DisclosureProps, Heading, Label, ListBox, ListBoxItem, Popover, Select, SelectValue} from 'react-aria-components';
import React, { Key, ReactNode } from 'react';
import Icon from '@mdi/react';
import { mdiChevronDown, mdiChevronUp, mdiDivingScubaFlag, mdiLightningBoltOutline, mdiOfficeBuildingCog, mdiOfficeBuildingCogOutline } from '@mdi/js';

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
      <Button slot="trigger" className="flex transition-all duration-200 hover:text-gray-100">
        <span className="text-lg">{title}</span>
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
      <Button slot="trigger" className="flex flex-row w-full items-center justify-between bg-secondary rounded-lg py-2 px-2 mb-2">
        <div className="flex align-middle items-center">
          <Icon className="w-7 min-w-7 h-auto" path={iconPath} />
          <span className="ml-3">
            {title}
          </span>
        </div>
        <Icon className={"w-7 min-w-7 h-auto transition-transform duration-150 ease-in-out " + (isExpanded ? "rotate-0" : "rotate-180")} path={ mdiChevronDown } />
      </Button>
      <DisclosurePanel className="w-full mb-8">
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
    <header className="w-72 flex flex-col bg-primary h-screen font-cairo">
      <div className="flex py-6 flex-row justify-center border-b-2 border-bg-secondary gap-1">
        <Icon className="rotate-12 w-7 min-w-7 text-yellow-400" path={mdiLightningBoltOutline}/>
        <h1 className="text-xl text-white font-semibold">Racetrack Control</h1>
        <Icon className="rotate-12 w-7 min-w-7 text-yellow-400" path={mdiLightningBoltOutline}/>
      </div>
      <nav className=" pb-8">
        <DisclosureGroup defaultExpandedKeys={['admin', 'display']} allowsMultipleExpanded className="h-full w-full pt-6 flex flex-col items-center ">
          <SidebarDisclosure 
          id="admin" 
          title="Front Desk" 
          iconPath={mdiOfficeBuildingCog} 
          items={[
            <SidebarItem title="Race Control" path="/admin/race-control"/>,
            <SidebarItem title="Lap-line Observer" path="/admin/race-control"/>,
            <SidebarItem title="Flag Bearer" path="/admin/race-control"/>
          ]}>
          </SidebarDisclosure>
          <SidebarDisclosure 
          id="display" 
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
    </header>
    </>
  );
}