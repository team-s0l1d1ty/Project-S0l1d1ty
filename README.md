# Project-S0l1d1ty
## Problem Statement
The downside to a centralized ID management means that it is susceptible to a single source of failure. In event that the central ID provider is made unavailable and rendered
non-recoverable, the central ID provider/agency will not be able to perform trust attestation or authentication of users and devices.

Thus, the solution has to explore adopting a _decentralised model of doing trust attestation_ such as using blockchains, smart contracts and immutable user profiles to ensure that users and devices connecting to government networks are _authorised, authenticated, secured_ and _security posture validated constantly_. New _users and devices can also be added to the blockchain via peer-to-peer validation_.

## Objective of PoC
Our Proof of Concept (PoC) seeks to illustrate how [Kilt Protocol](https://www.kilt.io/) can be used to address the following problems in the problem statement: 
1. adding of new users to blockchain via P2P validation
2. authentication and authorisation to service
3. constant validation of security posture

Although security of user and/or device is not demonstrated in our PoC, a high-level [suggestion](#Suggestion-for-Securing-User-Device-and-P2P-Communication) has been provided below.

Usage instructions can be found in our [Quickstart](https://github.com/team-s0l1d1ty/Project-S0l1d1ty/wiki/Quickstart).

### Technology Stack
- Frontend : HTML/CSS/Javascript
- Middleware : [NodeJS](https://nodejs.org/en/)/[HAPI](https://hapi.dev/)
- Backend : [Kilt-Protocol](https://www.kilt.io/)

### PoC High-level Architecture
For the ease of development, the PoC is built like a traditional webpage. There is a webserver

### PoC High-level Workflow
#### Adding of New User/Device via P2P Validation
#### Authentication and Authorisation to Service
#### Constant Validation of Security Posture

## Beyond the PoC
## Suggestion for Securing User Device, and P2P Communication
Over here we will discuss about the security of LightDID and FullDID as well as the security of the communication between Attester, Verifier and Claimer.

The solution that we are about to discuss is not included in the PoC to aid the rapid development of PoC but it can be built on top of the PoC to provide the security for User, Device and P2P communication

### Securing User and Devices
In the other implementations of Kilt-Protocol as seen in [socialKYC](https://socialkyc.io/), users, attesters and verifiers are secured by an external extension the [Sporran Wallet](https://github.com/BTE-Trusted-Entity/sporran-extension). Therefore, it is viable that in a custom implementation some form of ["Cold Wallet"](https://web3isgoinggreat.com/glossary) can be implemented to ensure the safety of the Account and Credentials.

### Securing P2P Communication
P2P communication between Attester and User, Verifier and User is done over HTTP which has to be secure by SSL (HTTPS). 

An additional layer of security is also provided at Application Level in the [Messaging API](https://kiltprotocol.github.io/sdk-js/modules/_kiltprotocol_messaging.html) which can allow for 

Examples can be found [here](https://github.com/BTE-Trusted-Entity/socialkyc.io/search?q=encrypt).

## Achieving Decentralisation
### Suggested Structure of Hierarchy

