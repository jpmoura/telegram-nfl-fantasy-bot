import 'reflect-metadata';
import { Container } from 'inversify';
import infraModule from '../../infra/Installer';
import applicationModule from '../../application/Installer';

const container = new Container();
container.load(applicationModule, infraModule);

export default container;
