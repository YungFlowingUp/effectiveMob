import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @Get('/allUsers')
    async getAllUsers(): Promise<string> {
        try {
            const users = await this.appService.getAll();            
            return JSON.stringify(users);
        } catch (error) {   
            console.log(error);                    
            throw new Error('Ошибка в запросе');
        }
    }

    @Get('/createMillionUsers')
    async createUser(): Promise<number> {
        try {
            const user = await this.appService.createMillionUsers();            
            return user;
        } catch (error) {   
            console.log(error);                    
            throw new Error('Ошибка в запросе');
        }
    }

    @Get('/randomUsersFlags')
    async randomUsersFlags(): Promise<number> {
        try {
            const users = await this.appService.randomChangeFlags();            
            return users
        } catch (error) {   
            console.log(error);                    
            throw new Error('Ошибка в запросе');
        }
    }

    @Get('/getAndChangeProblems')
    async getAndChangeProblems(): Promise<number> {
        try {
            const users = await this.appService.countAndChangeFlags();            
            return users
        } catch (error) {   
            console.log(error);                    
            throw new Error('Ошибка в запросе');
        }
    }
}
