# Beachside Racetrack Info-Screens System

A real-time race management and information system for Beachside Racetrack, designed to control races and inform spectators with minimal staff requirements.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Starting the Server](#starting-the-server)
- [User Guide](#user-guide)
- [API Routes](#api-routes)
- [Architecture](#architecture)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## Overview

The Beachside Racetrack Info-Screens System is a Node.js-based application that manages race sessions, tracks lap times, and provides real-time information to drivers, spectators, and staff. The system uses Socket.IO for real-time communication and is designed to work across multiple devices and screens throughout the racetrack facility.

## Features

### Core Functionality
- **Race Session Management**: Configure upcoming races with driver registration
- **Real-time Race Control**: Start races, control race modes (Safe/Hazard/Danger/Finish)
- **Lap Time Tracking**: Record and display lap times as cars cross the finish line
- **Live Leaderboards**: Real-time display of fastest lap times and current standings
- **Multi-screen Support**: Different interfaces for different user roles and display purposes

### User Interfaces
- **Front Desk**: Receptionist interface for race configuration
- **Race Control**: Safety Official interface for race management
- **Lap-line Tracker**: Observer interface for recording lap times
- **Leader Board**: Public display of race standings
- **Next Race**: Driver information display
- **Race Countdown**: Timer display for active races
- **Race Flags**: Flag status display around the track

## Technology Stack

- **Backend**: Node.js with Express
- **Real-time Communication**: Socket.IO
- **Frontend**: HTML5, CSS3, JavaScript (framework agnostic)
- **Data Storage**: In-memory (MVP version) with optional persistence
- **Security**: Environment variable-based access keys

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd racetrack-info-screens
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Start the server:
```bash
npm start
```

## Environment Variables

The system requires three access keys to be set as environment variables before starting. These have been pre-set for you:


### Access Keys:
```bash
Access key for /front-desk = rec
Access key for /lap-line-tracker = lap
Access key for /race-control = safe
```


## Starting the Server

### Production Mode (10-minute races):
```bash
npm start
```

### Development Mode (1-minute races):
```bash
npm run dev
```

The server will start and display the available routes. Make sure your chosen method for exposing interfaces (ngrok, port forwarding, etc.) is configured.

## User Guide

### 1. Front Desk Operations (Receptionist)

**Access**: Navigate to `/front-desk` and enter the receptionist access key.

#### Managing Race Sessions:
1. **View Upcoming Races**: See a list of all configured race sessions
2. **Add New Race Session**: 
   - Click "Add Race Session"

3. **Add Drivers to Race**:
   - Select a timeslot
   - Enter drivers names (must be unique within the session)

4. **Remove Drivers**: Click the "Modify Race" button and delete the name of the driver you wish to remove.
5. **Delete Race Sessions**: Click the "Delete Race" button on the race card you wish to remove.


### 2. Race Control (Safety Official)

**Access**: Navigate to `/race-control` and enter the safety official access key.

#### Starting a Race:
1. **Pre-Race Setup**:
   - View next pending race session and assigned drivers/cars
   
2. **Start Race**:
   - Click "Start Race" button
   - Race mode automatically changes to "Safe"
   - 10-minute countdown begins (1-minute countdown for dev mode)
   - Race Control buttons appear

#### Controlling Race Modes:
- **Safe Mode**: Green flag - normal racing conditions
- **Hazard Mode**: Yellow flag - drive slowly, hazard on track  
- **Danger Mode**: Red flag - stop driving immediately, the timer also stops
- **Finish Mode**: Chequered flag - race complete, return to pit lane

#### Ending a Race:
1. Race automatically finishes after 10 minutes (1 minute in dev mode) OR click "Finish Race"
2. Click "End Session" once all cars return to pit lane
3. Next race session is queued automatically


### 3. Lap-line Tracking (Observer)

**Access**: Navigate to `/lap-line-tracker` and enter the observer access key.

#### Recording Lap Times:
1. **Interface Layout**: Buttons numbered 1-8 for each car
2. **Recording Laps**: Press the corresponding car number button as each car crosses the finish line
3. **During Race**: Buttons are active and responsive
4. **After Race**: Buttons are disabled when race ends

**Important**: The interface works in both portrait and landscape orientations for tablet use.


### 4. Public Display Interfaces

These interfaces require no access keys and update automatically:

#### Leader Board (`/leader-board`)
- **Current Race Standings**: Cars ordered by fastest lap time  
- **Race Timer**: Shows remaining time in current race
- **Flag Status**: Visual indicator of current race mode
- **Driver Information**: Car numbers, driver names, lap counts

#### Next Race (`/next-race`)  
- **Upcoming Drivers**: List of drivers in next race session
- **Car Assignments**: Shows which car each driver will use
- **Paddock Notification**: Message when drivers should proceed to paddock

#### Race Countdown (`/race-countdown`)
- **Race Timer**: Large countdown display for active race


#### Race Flags (`/race-flags`)
- **Flag Display**: Colored backgrounds representing current race mode, can be toggled fullscreen:
  - **Green**: Safe conditions
  - **Yellow**: Hazard conditions  
  - **Red**: Danger conditions
  - **Chequered**: Race finished

## API Routes

### Public Interfaces
- `/leader-board` - Spectator leaderboard display
- `/next-race` - Next race information for drivers  
- `/race-countdown` - Race timer display
- `/race-flags` - Flag status display

### Admin Interfaces (Password Protected)
- `/front-desk` - Receptionist race configuration
- `/race-control` - Safety official race management
- `/lap-line-tracker` - Lap time recording interface

## Architecture

### Real-time Communication
The system uses Socket.IO for all real-time updates:
- **Race state changes** broadcast to all connected clients
- **Lap time updates** sent immediately to leaderboards
- **Race mode changes** update flag displays instantly
- **Timer updates** synchronized across all interfaces

### Data Flow
1. **Race Configuration**: Receptionist → Server → All displays update
2. **Race Control**: Safety Official → Server → All race interfaces update  
3. **Lap Recording**: Observer → Server → Leaderboards update
4. **Automatic Events**: Timer expiry → Server → All interfaces update

### Security Model
- **Role-based Access**: Each employee interface requires unique access key
- **Delayed Response**: 500ms delay on incorrect password attempts
- **Environment-based Keys**: Access keys stored as environment variables
