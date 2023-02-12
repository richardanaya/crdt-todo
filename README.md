# CRDT-Todo
A CRDT-powered TODO application built using Automerge.

## What is a CRDT?
A Conflict-free Replicated Data Type (CRDT) is a data structure that allows multiple replicas to be updated independently and then merged together in a conflict-free manner. This enables collaboration in asyhcronous, real-time, and offline scenarios, where each replica can be updated independently and then merged together when they are synced.

## What is Automerge?
Automerge is an npm library for creating and merging CRDTs. It provides a simple interface for creating and manipulating conflict-free data structures that can be shared across multiple clients.

## How does this project work?
This project is a simple TODO application that demonstrates the use of CRDTs using Automerge. You can load, save, and merge binary representations of your workspace state. The application is meant to be a starting point for building your own CRDT-enabled applications.

## Key Features
- Load, save, and merge binary representations of your workspace state.
- Real-time collaboration using CRDTs.
- Works offline and online.
- Built using Automerge, a simple and powerful library for building CRDTs.

## Getting Started
To get started with this project, you'll need to have Node.js and npm installed. Then, simply clone the repository and run `npm install` to install the dependencies.

Once you have the dependencies installed, you can start the application by running `npm start`.

