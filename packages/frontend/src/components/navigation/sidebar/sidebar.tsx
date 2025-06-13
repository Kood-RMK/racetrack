'use client'

import {Button, Disclosure, DisclosureGroup, DisclosurePanel, DisclosureProps} from 'react-aria-components';
import React, { ReactNode } from 'react';
import Icon from '@mdi/react';
import { mdiCarCruiseControl, mdiChevronDown, mdiDivingScubaFlag, mdiMenu, mdiMenuOpen, mdiOfficeBuildingCog } from '@mdi/js';
import Link from 'next/link';

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
    <Link href={path} className='flex transition-all duration-200 hover:text-gray-300'>
        <span className="text-lg">{title}</span>
    </Link>
  )
}

function SidebarDisclosure({title, iconPath, items, children, ...props}: SidebarDisclosureProps) {
  return (
    <Disclosure  
    className="text-white w-full flex flex-col items-center font-cairo text-lg font-medium"
    {...props}
    >
      <Button
        slot="trigger" 
        className="group flex flex-row w-full items-center justify-between bg-secondary rounded-lg py-2 px-2 mb-2"
        >
        <div className="flex align-middle items-center">
          <Icon className="w-7 min-w-7 h-auto" path={iconPath} />
          <span className="ml-3">
            {title}
          </span>
        </div>
        <Icon className={"w-7 min-w-7 h-auto transition-transform duration-200 ease-in-out group-aria-expanded:rotate-180"} path={ mdiChevronDown } />
      </Button>
      <DisclosurePanel 
        className="w-full mb-8"
  
        aria-label={`${title} options`}
      >
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

  const [isSidebarOpen, setIsSidebarOpen ] = React.useState(true);

  return (
    <header
      className={` h-full ${isSidebarOpen ? 'fixed md:relative' : 'fixed'  } z-10 left-0 top-0 flex flex-row font-cairo overflow-auto `}
      role="navigation"
      aria-label="Sidebar">
        <div className={`bg-primary px-6 h-full transform  transition-transform duration-200 ${isSidebarOpen ? 'translate-x-0 ' : '-translate-x-full fixed'}`}>
          <div className="flex w-full py-6 items-center flex-col justify-center border-b-2 border-bg-secondary gap-1">
            <h1 className="text-2xl text-white font-semibold">Racetrack Control</h1>
            <h1 className="text-md text-gray-100 font-semibold">ACME Corp.</h1>
          </div>
          <nav className="flex flex-col w-64">
            {/* NAV MENU */}
            <DisclosureGroup
              allowsMultipleExpanded  
              defaultExpandedKeys={['admin', 'display']}
              className="w-full pt-6 flex flex-1 flex-col items-center">
                <SidebarDisclosure 
                  id="admin" 
                  title="Front Desk" 
                  iconPath={mdiOfficeBuildingCog} 
                  items={[
                    <SidebarItem title="Race Schedule" path="/front-desk"/>
                  ]}
                  >
                </SidebarDisclosure>
                <SidebarDisclosure 
                  id="display" 
                  title="Race Display" 
                  iconPath={mdiDivingScubaFlag} 
                  items={[
                    <SidebarItem title="Leaderboard" path="/leader-board"/>,
                    <SidebarItem title="Next Race" path="/next-race"/>,
                    <SidebarItem title="Countdown" path="/race-countdown"/>,
                    <SidebarItem title="Race Flag" path="/race-flags"/>,
                  ]}>
                  Details about system requirements here
              </SidebarDisclosure>

              <SidebarDisclosure 
                id="display1" 
                title="Race Control" 
                iconPath={mdiCarCruiseControl} 
                items={[
                  <SidebarItem title="Race Safety" path="/race-control"/>,
                  <SidebarItem title="Lap-line Observer" path="/lap-line-tracker"/>
                ]}>
                Details about system requirements here
              </SidebarDisclosure>
            </DisclosureGroup>

            {/* USER MENU */}
            {/* <SidebarUserManagement>
            </SidebarUserManagement> */}
          </nav>
        </div>
      <div className='h-full'>
          <Button 
          className={`ml-2 mt-4`}
          onPress={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <div 
              className='p-2 hover:bg-gray-200/50 rounded-md duration-100 ease-in-out'>
              <Icon className="w-8 h-auto text-black" path={ isSidebarOpen ? mdiMenuOpen : mdiMenu} />
            </div>
          </Button>
      </div>
    </header>
  );
}
