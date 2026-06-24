# VeriQore – Blockchain-Based Certificate Verification System

## Overview

VeriQore is a full-stack blockchain-based certificate verification platform designed to address academic certificate fraud through cryptographic hashing, blockchain technology, cloud storage, and role-based authentication.

The platform enables educational institutions to issue secure digital certificates, allows students to access and monitor their credentials, and enables recruiters to verify certificate authenticity without contacting the issuing institution.

VeriQore combines React.js, Node.js, Express.js, MongoDB Atlas, Cloudinary, Ethereum Sepolia, Solidity smart contracts, MetaMask integration, JWT authentication, and SHA-256 hashing to create a secure and transparent certificate verification ecosystem.

---

## Live Demo

Application:

https://veriqore.vercel.app

---

## Demo Video

A complete walkthrough demonstrating:

- Landing Page
- Authentication System
- Master Admin Dashboard
- College Admin Dashboard
- Student Dashboard
- Recruiter Dashboard
- Certificate Issuance Workflow
- Blockchain Integration
- Certificate Verification Process
- Verification History Tracking
- Error Handling Pages

Video link will be added soon.

---

## Problem Statement

Academic certificate fraud remains a significant challenge for educational institutions, students, and recruiters.

Traditional certificate verification methods often require manual communication with institutions, resulting in:

- Long verification times
- Administrative overhead
- Increased operational costs
- Risk of forged certificates
- Lack of transparency

VeriQore addresses these challenges by introducing blockchain-backed certificate verification that enables instant authenticity validation.

---

## Project Objectives

- Prevent academic certificate forgery
- Detect certificate tampering instantly
- Eliminate manual verification processes
- Provide blockchain-backed transparency
- Enable secure certificate issuance
- Create a scalable certificate verification platform

---

## Core Features

### Blockchain Certificate Issuance

Educational institutions can securely issue certificates to students.

Each certificate receives a blockchain-backed verification record.

---

### SHA-256 Certificate Hashing

Each uploaded certificate is converted into a SHA-256 cryptographic hash.

The generated hash acts as the certificate's digital fingerprint.

Any modification to the certificate generates a completely different hash value.

---

### Ethereum Blockchain Verification

Certificate hashes are stored on the Ethereum Sepolia blockchain using Solidity smart contracts.

Blockchain storage provides:

- Immutability
- Transparency
- Public verification
- Tamper resistance

---

### Smart Contract Integration

VeriQore uses a Solidity smart contract deployed on the Ethereum Sepolia network.

The smart contract is responsible for:

- Storing certificate SHA-256 hashes
- Maintaining immutable verification records
- Providing blockchain-backed proof of authenticity
- Preventing modification of issued certificate fingerprints

Smart Contract:

CertificateVerification.sol

---

### Cloudinary Integration

Original certificate PDFs are securely stored using Cloudinary.

Only certificate fingerprints are stored on-chain.

This significantly reduces blockchain storage costs.

---

### Role-Based Access Control

The platform supports four user roles:

- Master Administrator
- College Administrator
- Student
- Recruiter

Each role has dedicated permissions and protected routes.

---

### Verification History Tracking

Verification activities are recorded and made available to authorized users.

Students can track verification activity associated with their certificates.

---

### Custom Error Handling

The application includes dedicated error pages for:

- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Internal Server Error

---

## System Architecture

### MongoDB Atlas

Stores:

- User Information
- Student Information
- College Information
- Certificate Metadata
- Verification Records
- Blockchain Transaction References

### Cloudinary

Stores:

- Original Certificate PDFs

### Ethereum Sepolia Blockchain

Stores:

- SHA-256 Certificate Hashes

### MetaMask

Handles:

- Wallet Connection
- Transaction Authorization
- Transaction Signing

---

## SHA-256 Hashing Workflow

When a certificate PDF is uploaded:

1. The system reads the document.
2. SHA-256 generates a unique hash.
3. The hash becomes the certificate's digital fingerprint.

VeriQore does not verify certificates using:

- File Name
- File Size
- Upload Date
- File Location

Instead, verification is performed using the actual document contents.

If even a single character changes within the certificate, a completely different hash is generated.

This allows VeriQore to instantly detect certificate tampering.

---

## Certificate Issuance Workflow

College Administrator Uploads Certificate

↓

Generate SHA-256 Hash

↓

Duplicate Certificate Detection

↓

Upload PDF to Cloudinary

↓

Prepare Certificate Metadata

↓

MetaMask Approval

↓

Store Hash on Ethereum Sepolia

↓

Receive Blockchain Transaction Hash

↓

Store Metadata in MongoDB Atlas

↓

Certificate Successfully Issued

---

## Certificate Verification Workflow

Recruiter Uploads Certificate

↓

Generate SHA-256 Hash

↓

Retrieve Blockchain Hash

↓

Compare Hashes

↓

Verification Result

If Hashes Match:

VALID

If Hashes Do Not Match:

INVALID

---

## User Roles

### Master Administrator

Platform-wide administration.

Capabilities:

- Dashboard Analytics
- College Management
- College Administrator Management
- Student Management
- Recruiter Management
- Certificate Monitoring
- Verification Monitoring

---

### College Administrator

Certificate issuance and management.

Capabilities:

- Student Management
- Certificate Upload
- SHA-256 Hash Generation
- Blockchain Registration
- Certificate Monitoring

---

### Student

Student self-service portal.

Capabilities:

- View Certificates
- View Certificate Information
- View Blockchain Details
- View Verification History

---

### Recruiter

Certificate verification portal.

Capabilities:

- Upload Certificates
- Verify Authenticity
- View Verification Results
- Access Blockchain References

---

## Demo Access

VeriQore includes role-based demo accounts allowing visitors to explore the platform.

Available Roles:

- Master Administrator
- College Administrator
- Student
- Recruiter

Demo credentials are available directly on the login page.

---

## Screenshots

### Landing Page

(Add Screenshot)

### Login Page

(Add Screenshot)

### Master Administrator Dashboard

(Add Screenshot)

### College Administrator Dashboard

(Add Screenshot)

### Student Dashboard

(Add Screenshot)

### Recruiter Dashboard

(Add Screenshot)

### Certificate Verification Result

(Add Screenshot)

### Verification History

(Add Screenshot)

### Error Pages

(Add Screenshot)

---

## Security Features

### JWT Authentication

Secures user sessions and API access.

### Protected Routes

Prevents unauthorized access to restricted resources.

### Role-Based Authorization

Access permissions are enforced based on assigned roles.

### Duplicate Certificate Detection

Helps prevent duplicate certificate issuance.

### MetaMask Transaction Approval

Blockchain transactions require explicit user approval.

### Blockchain Immutability

Certificate fingerprints cannot be modified after blockchain confirmation.

---

## Technology Stack

### Frontend

- React.js
- React Router
- Axios
- Framer Motion
- CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas

### Cloud Storage

- Cloudinary

### Blockchain

- Ethereum Sepolia

### Smart Contracts

- Solidity

### Wallet Integration

- MetaMask

### Blockchain Communication

- Web3.js

### Authentication

- JWT

### Security

- SHA-256 Hashing

---

## Project Structure

blockchain-certificate-verification

├── frontend
├── backend
├── blockchain
└── README.md

---

## Error Pages

### 401 Unauthorized

Displayed when users attempt to access protected resources without authentication.

### 403 Forbidden

Displayed when users attempt to access resources outside their permissions.

### 404 Not Found

Displayed when users navigate to unavailable routes.

### 500 Internal Server Error

Displayed when unexpected server-side failures occur.

---

## Future Enhancements

Potential future improvements include:

- IPFS Integration
- QR Code Verification
- Mobile Application
- Multi-University Support
- Decentralized Identity Integration

---

## Author

**Thiruharikaran R**

B.Tech Information Technology

Blockchain & Full-Stack Developer

---

## Usage Notice

This project was developed for portfolio, learning, and demonstration purposes.

All rights reserved © Thiruharikaran R.

---

## Conclusion

VeriQore demonstrates how blockchain technology can be integrated with modern web applications to build a secure, transparent, and tamper-resistant certificate verification platform.

By combining SHA-256 hashing, Ethereum blockchain, Cloudinary cloud storage, MongoDB Atlas, JWT authentication, MetaMask integration, and role-based access control, VeriQore provides an end-to-end solution for trusted academic credential verification.
