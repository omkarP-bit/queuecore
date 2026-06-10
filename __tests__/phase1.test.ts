import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Phase 1: Project Setup & Schema', () => {
  it('should have the required directory structure', () => {
    const requiredDirs = ['src/app', 'src/app/patient', 'src/app/receptionist', 'src/app/api', 'src/lib', 'src/components', 'infrastructure/kubernetes'];
    requiredDirs.forEach(dir => {
      expect(fs.existsSync(path.join(process.cwd(), dir))).toBe(true);
    });
  });

  it('should have the schema.sql file with tables', () => {
    const schemaContent = fs.readFileSync(path.join(process.cwd(), 'src/database/schema.sql'), 'utf-8');
    expect(schemaContent).toContain('CREATE TABLE hospitals');
    expect(schemaContent).toContain('CREATE TABLE doctors');
    expect(schemaContent).toContain('CREATE TABLE patients');
    expect(schemaContent).toContain('CREATE TABLE tokens');
  });

  it('should have a Dockerfile for multi-stage build', () => {
    const dockerfile = fs.readFileSync(path.join(process.cwd(), 'Dockerfile'), 'utf-8');
    expect(dockerfile).toContain('FROM node:20-alpine AS deps');
    expect(dockerfile).toContain('FROM node:20-alpine AS builder');
    expect(dockerfile).toContain('FROM node:20-alpine AS runner');
  });
});
