# Project-S0l1d1ty
## Problem Statement
The downside to a centralized ID management means that it is susceptible to a single source of failure. In event that the central ID provider is made unavailable and rendered
non-recoverable, the central ID provider/agency will not be able to perform trust attestation or authentication of users and devices.

Thus, the solution has to explore adopting a _decentralised model of doing trust attestation_ such as using blockchains, smart contracts and immutable user profiles to ensure that users and devices connecting to government networks are _authorised, authenticated, secured_ and _security posture validated constantly_. New _users and devices can also be added to the blockchain via peer-to-peer validation_.

## Objective of PoC
Our Proof of Concept (PoC) seeks to illustrate how Kilt Protocol can be used to address the following problems in the problem statement: 
1. adding of new users to blockchain via P2P validation
2. authentication and authorisation to service
3. constant validation of security posture

Although security of user and/or device is not demonstrated in our PoC, a high-level [suggestion](#Suggestion-for-Securing-User-or-Device) has been provided below.

Usage instructions can be found in out [Wiki](https://github.com/team-s0l1d1ty/Project-S0l1d1ty/wiki).

### Technology Stack
- Frontend : HTML/CSS/Javascript
- Middleware : [NodeJS](https://nodejs.org/en/)/[HAPI](https://hapi.dev/)
- Backend : [Kilt-Protocol](https://www.kilt.io/)

### High-level Architecture

### High-level Workflow
#### Adding of New User/Device via P2P Validation
#### Authentication and Authorisation to Service
#### Constant Validation of Security Posture

### Suggestion for Securing User, Device and P2P Communication
Over here we will discuss about the security of LightDID and FullDID as well as the security of the communication between Attester, Verifier and Claimer.

The solution that we are about to discuss is not included in the PoC but it can be built on top of the PoC to provide the security for User, Device and P2P communication
