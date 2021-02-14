import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

fdescribe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
    service.nuke();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getContext should retrieve the current context', () => {
    expect(service.getContext()).toEqual('default');
  });

  it('setContext should set the current context', () => {
    service.setContext('game');
    expect(service.getContext()).toEqual('game');
  });

  it('store should create an entry', () => {
    service.store('name', 'jim');
    expect(service.fetch('name')).toEqual('jim');
  });

  it('fetch should return error code if entry does not exist', () => {
    const result = service.fetch('oof');
    expect(result).toEqual('ERR');
  });

  it('fetch should return value', () => {
    service.store('name', 'jim');
    const result = service.fetch('name');
    expect(result).toEqual('jim');
  });

  it('update should replace existing value', () => {
    service.store('tutorial', 'false');
    service.update('tutorial', 'true');
    expect(service.fetch('tutorial')).toEqual('true');
  });

  it('update should create if value did not exist', () => {
    service.update('gamemode', 'pvp');
    expect(service.fetch('gamemode')).toEqual('pvp');
  });

  it('delete should remove entry', () => {
    service.store('gamemode', 'pva');
    service.delete('gamemode');
    expect(service.fetch('gamemode')).toEqual('ERR');
  });
});
