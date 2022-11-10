# Project-S0l1d1ty
- [Problem Statement](#problem-statement)
- [Concept of Claim, Attestation and Verification](#concept-of-claim-attestation-and-verification)
  - [Overview of Transactions](#overview-of-transactions)
- [Objective of PoC](#objective-of-poc)
- [PoC High-level Architecture](#poc-high-level-architecture)
  - [Technology Stack](#technology-stack)
- [PoC High-level Workflow](#poc-high-level-workflow)
  - [Adding of New User via P2P Validation](#adding-of-new-user-via-p2p-validation)
  - [Authentication and Authorisation](#authentication-and-authorisation)
  - [Constant Validation of Security Posture](#constant-validation-of-security-posture)
- [Beyond the PoC](#beyond-the-poc)
  - [Scaling with Distributed Trust](#scaling-with-distributed-trust)
     - [Delegate Rights](#delegate-rights)
     - [Revoking Delegated Rights](#revoking-delegated-rights)
  - [Securing of light and full DID](#securing-of-light-and-full-did)
  - [Securing P2P Communication](#securing-p2p-communication)
  - [Scaling with serverless architecture](#scaling-with-serverless-architecture)
  - [Bring Your Own Blockchain](#bring-your-own-blockchain)
     - [Phishing prevention](#phishing-prevention)
     - [IoTs role-based access control](#iots-role-based-access-control)
- [Demo Video](#demo-video)
- [Afterword](#afterword)
   - [Challenges](#challenges)

## Problem Statement
The downside to a centralized ID management means that it is susceptible to a single source of failure. In event that the central ID provider is made unavailable and rendered
non-recoverable, the central ID provider/agency will not be able to perform trust attestation or authentication of users and devices.

Thus, the solution has to explore adopting a _decentralised model of doing trust attestation_ such as using blockchains, smart contracts and immutable user profiles to ensure that users and devices connecting to government networks are _authorised, authenticated, secured_ and _security posture validated constantly_. New _users and devices can also be added to the blockchain via peer-to-peer validation_.

## Concept of Claim, Attestation and Verification
### Overview of Transactions
![image](https://user-images.githubusercontent.com/115341229/199501575-7a06c797-34f1-4d94-810e-b64564bf5c34.png)

There are 3 roles in a transaction : 
- Claimer : A claimer is an entity that is claiming a credential and requesting an attestment for the credential. 
- Verifier : A verifier is an entity that is verifying the credential through querying the blockchain for the validity of the attestation of the credential.
- Attester : An Attester is an entity that has the ability to attest to a credential and write to the blockchain a proof of attestation.

## Objective of PoC
Our Proof of Concept (PoC) seeks to illustrate how the concept above can be used to address the following problems in the problem statement  : 
1. Adding of new users to blockchain via P2P validation (Credential Attestation)
2. Authentication and authorisation to service (Credential Verification)
3. Constant validation of security posture (Credential Revocation)

Although security of user and/or device is not demonstrated in our PoC, a high-level suggestion - [Securing P2P Communication](#securing-p2p-communication) has been provided below. Additionally, [Beyond the PoC](#beyond-the-poc) section will explain additional mechanisms not illustrated by the PoC.

Usage instructions of our PoC can be found in our [Quickstart](https://github.com/team-s0l1d1ty/Project-S0l1d1ty/wiki/Quickstart).

Shown below is a use case diagram which will form the basis of our PoC.

| Use Case                |                                                                                                                  |
|-------------------------|------------------------------------------------------------------------------------------------------------------|
| Credential Attestation | ![image](https://user-images.githubusercontent.com/115341229/200212847-009da606-7393-4e84-8adc-f872d6e0c079.png) |
| Credential Verification | <img src="https://user-images.githubusercontent.com/115341229/200213960-8aa12c21-5d09-472c-8a15-9f630167853d.png" width=86% height=86%> |
| Credential Revocation   | <img src="https://user-images.githubusercontent.com/115341229/200215738-a3632e45-80e4-4465-b710-bbb92083abdd.png" width=87% height=87%> |


## PoC High-level Architecture
To demonstrate clearly the workflow as well as for ease of development, the PoC is built like a traditional client-server architecture but with a slight twist. 

![image](https://user-images.githubusercontent.com/115341229/200222444-0e61406b-e995-42fc-9c88-68dc753eb48d.png)

As can be seen above : 
1. Client communicates with Attestation Webserver/Service like any Client-Server architecture.
2. Instead of an centralised authentication database / oauth system, webserver directly querying the blockchain

### Technology Stack
- Frontend : HTML/CSS/Javascript
- Middleware : [NodeJS](https://nodejs.org/en/)/[HAPI](https://hapi.dev/)
- Backend : [Kilt-Protocol 0.28](https://www.kilt.io/)

## PoC High-level Workflow

### Adding of New User via P2P Validation
![image](https://user-images.githubusercontent.com/115341229/200221519-9dc26345-1023-419b-ace8-43f3775459ab.png) 

1. User will enter and send their claim through POST request to server
2. Server will store the claim as a string in a temp file.
3. Attester will access the webserver through the Attester dashboard, and read the temp file for attestation request.
4. Once Attester validated the information provided, it will write the attestation onto the blockchain.
5. Blockhain will return the hash back to the attester.
6. Attester then sends the credential with the attesment hash back to the client.

### Authentication and Authorisation
![image](https://user-images.githubusercontent.com/115341229/200223103-31dbfe70-ad46-430c-9b64-43e9dab08ec5.png)

1. User will be presented a login page.
2. User enter and sends in credential and mnemonic of DID that claimed the credential via a POST request
3. Server received POST request, check's if it is the correct CType (credential format) and verifies the credential by querying the blockchain for it's attestation.
4. If verification is successful, server allows access to service. Else access to service is denied. 

### Constant Validation of Security Posture
![image](https://user-images.githubusercontent.com/115341229/200229434-be577bc0-afea-48c6-accf-6100d193caf6.png)

1. In the same attester portal, an attester can revoke credentials that they attested.
2. When credentials are removed or revoked, they are not removed on the user-end, changes are made on the blockchain  
3. There is a remove attestation function which was not implemented in the PoC.
4. The difference between revoking and removing is : 
   - Revoke : The attestation is still present on the blockchain but with a `"revoked":false` flag set.
   - Remove : Attestation is removed from the blockchain. 

## Beyond the PoC
This section will talk about ideas and Kilt-Protocol mechanisms in terms of scaling and security not shown in the PoC.

### Scaling with Distributed Trust
In Kilt-Protocol, any user with Full DID will be able to do trust attestation. This in itself is a benefit as now any users will be able to attest for claims where there are other use cases for example digital signing, but this is beyond the scope of our problem statement. 

The issue with trust attestation by any Full DID is the issue of legitimacy of the attestation. This is easily solved by verifying the DID of the attester.

![image](https://user-images.githubusercontent.com/115341229/200254343-0732712f-7f26-4ae0-8a18-0ee1c50a6b19.png)

As seen above, in an attested credential, the DID of the attester will always be revealed and if we know that the Attester ID can be trusted (DID can be posted on Official pages, hard-coded into an address book etc.), then the attestation is valid. 

Then a new problem arises - what if the attester is not an individual but an organisation? How then can we scale up the number of attesters but not need to keep a big address book? Kilt has 2 solutions for this and they are [**Delegation**](https://kiltprotocol.github.io/sdk-js/classes/_kiltprotocol_core.DelegationNode.html) and **Virtual Credential Organisation (not implemented yet in Kilt)**

#### Delegate Rights

![image](https://user-images.githubusercontent.com/115341229/199498802-3dba5e20-8758-4d47-9fc5-9bfdbdfb3cd0.png)

Delegation hierarchy organise their members in a traditional hierarchical structure, and are modeled as a Tree data structure (see diagram above). 

There are 2 kinds of rights that can be given

- The root of the delegation and it's assigned "delegator" can assign delegation and/or attest rights to it's child.
   - Referring to the diagram above, Attester 2 has the rights to delegate attester and delegation rights to more DIDs, but Attester 3 is only given the right to delegate more Attesters but not Attest for Attester 1 itself.
   - Attester 4 and 5 is given attest rights by Attester 3 to only attest credentials for Attester 1 but not delegate attester/delegator rights.

#### Revoking Delegated Rights
Only the parents of a given Attester can change or remove the Attester's delegation itself or any of its children. 

For example, Attester 2 cannot change the delegation information for Attester 4, but Attester 1 and Attester 3 can both remove Attester 4 from the organization, or give them permission to also delgate new people.

Credential revocation works similarly, where the credential can be revoked by any parent or by the original attester. 

For example, Attester 2 cannot revoke credentials issued by Attester 1, 3, 4 and 5. Attester 1 can revoke any credentials and Attester 4 and 5 can only revoke credentials that they attest but not each others'.

### Securing of light and full DID
In the other implementations of Kilt-Protocol as seen in [socialKYC](https://socialkyc.io/), users, attesters and verifiers are secured by an external extension the [Sporran Wallet](https://github.com/BTE-Trusted-Entity/sporran-extension). Therefore, it is viable that in a custom implementation some form of ["Cold Wallet"](https://web3isgoinggreat.com/glossary) can be implemented to ensure the safe storage of the Account and Credentials as well as a means of accessing services.

### Securing P2P Communication
P2P communication between Attester and User, Verifier and User is done over HTTP and naturally has to be secured by SSL (HTTPS). 

An additional layer of security is also provided at [Application Level](https://docs.kilt.io/docs/concepts/messaging) in the [Messaging API](https://kiltprotocol.github.io/sdk-js/modules/_kiltprotocol_messaging.html) which gives additional encapsulation for user credentials and accounts. 

Examples of its implementations can be found [here](https://github.com/BTE-Trusted-Entity/socialkyc.io/search?q=encrypt).

Apart from what the PoC has attempted to illustrate, in actual implementation a web3name is suggested to be linked to the Attester/Verifier instance. This web3name can then be verified by the user similar to what is done in this [quickstart documentation](https://docs.kilt.io/docs/develop/sdk/quickstart) done by the Kilt Team. 

![image](https://user-images.githubusercontent.com/115341229/200239866-0f192ef7-53b4-471c-86b5-fc7dbaa65678.png)

Lastly, an additional verification step can be implemented like above (similar to a 2-way SSL authentication) and it can better help in preventing malicious acts such as phishing as user can now verify if the service they giving their credentials to is legitimate or not.


### Scaling with serverless architecture
![image](https://user-images.githubusercontent.com/115341229/200328149-88573fb8-2302-47d3-8a91-243b9fbcdb7d.png)



Most of the functions (i.e claiming, attesting, delegation, revocation and verification) can be deployed on FaaS (e.g AWS lamda, Google Cloud Functions or Azure Functions) as the aforementioned functions can be easily designed:  
1. To make use of short and single purpose APIs or webservices.
2. To be stateless such that local resources and processes are not reused.

Therefore, a serverless architecure can provide better :
1. **availability** as there is no server downtime, and we we solely depend on CSPs SLA Uptime which is at least 99.95%. 
2. **scalability** as functions in FaaS can be spun up as quickly as the CSPs can handle
3. **security and privacy**[[1]](https://www.checkpoint.com/cyber-hub/cloud-security/what-is-serverless-security/) [[2]](https://documents.trendmicro.com/assets/white_papers/wp-securing-weak-points-in-serverless-architectures-risks-and-recommendations.pdf) as 
   - we eliminate the need to secure the infrastructure (OS hardening, patching, server configurations etc).
   - ephemeral execution makes attacks difficult as the amount of time in the system is restricted to the timeout set.  
   - ephemeral execution makes data private as it is destroyed and not stored in the memory
   - fine-grained security controls with IAM will restrict the impact of an attack. 
   - short and single purpose APIs introduces less bugs as compared to monolithic applications
   - Focused on securing solely the endpoints, code, storage and accessibility of data.
4. **lower cost** as FaaS services charges based on per invocation basis and StaaS charges based on per Gb data stored and per 1000 requests.

### Bring Your Own Blockchain
Following this [guide](https://docs.kilt.io/docs/develop/sdk/chain_setup/standalone-chain-setup), as well as the fact that Kilt is a parachain of Polkadot blockchain, built using [Substrate](https://substrate.io/), it will be possible to deploy a private or hybrid blockchain. A private blockchain can focus mainly on access control and performance which is essential in DID. Whereas, hybrid network focuses on flexible infrastructure settings. To understand which network is required, we will have to look at the potential of this POC.

#### Phishing prevention
One of the biggest problem in Singapore is phishing websites. Humans are not able to verify the integrity of the website and fail to identify a phishing site. However, with DIDs, it is possible for user to identify an official site. Here's a brief description on how it can be done.
1) Every website is considered a claimer. Each claimer will send a set of site credentials for an attester to approve.
2) Once the website is approved by an attester, it will be stored in the blockchain while returning the credential to the site
3) Any individual that visit the site will be known as a verifier. A verifier can request a check on credential from the site and match it with the blockchain. If it matches, the site is valid, else it is a phishing site

Since there are both public and private facing items, a hybrid blockchain will be required for this setup. A set of permissions are required for attesters to approve the credentials submitted by claimers while the public facing blockchain is open for verifiers to request for a check.

#### IoTs role-based access control
For the longest time, IoTs are managed by IP based access controls. It is insufficient to have IP based access control as well. However with DIDs, we can assign role based access control to IoTs. Here's a brief description on how it can be done.
1) Every IoTs is considered a claimer/verifier. Each IoTs will send a set of credentials for an attester to approve.
2) Upon approval, these credentials will be store in a blockchain.
3) If an IoT goes rogue and tries to access other network, the role based access control will kick in and deny the process before the IP based access control kicks in

In this scenario, there isn't any public facing items. Furthermore, asset ownership and access control is important in managing this group of IoTs. Therefore private blockchain can be used.

## Demo Video

## Afterword
During our journey in this hackathon, our team has faced with a number of challenges:
1. Building a PoC instead of an actual Prototype
2. Using of Testnet as compared to building the node ourself
3. Lack of resource
