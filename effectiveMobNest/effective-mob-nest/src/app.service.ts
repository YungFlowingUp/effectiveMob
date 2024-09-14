import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async getAll(): Promise<User[]> {
        try {
            return await this.usersRepository.find();
        } catch (error) {          
            console.log(error);                   
        }
    }

    async createMillionUsers(): Promise<number> {
        try {
            let quantity = await this.countUsers();
            let inserted = 0;  
            while (quantity <= 1000000) {
                const firstName = this.generateName(Math.floor(Math.random() * (18 - 5) + 5));
                const lastName = this.generateName(Math.floor(Math.random() * (18 - 5) + 5));
                const age = Math.floor(Math.random() * (100 - 18) + 18);
                const sex = this.generateSex(Math.random());
                const problem = this.generateProblem(Math.random());           
                          
                const cretedUser = await this.usersRepository.insert({firstName, lastName, age, sex, problem: problem});
                console.log(cretedUser);
                inserted++;
                quantity++;
            }            
            return inserted        
        } catch (error) {          
            console.log(error);                   
        }
    }

    async randomChangeFlags(): Promise<number> {                          
        const updatedFlags = await this.usersRepository.update({id: Between(1, await this.countUsers())}, {problem: this.generateProblem(Math.random())});           
        
        return updatedFlags.affected 
    }

    async countAndChangeFlags(): Promise<number> {
        const problemUsers = await this.usersRepository.countBy({problem: true});
        await this.usersRepository.update({problem: true}, {problem: false});

        return problemUsers
    }

    async countUsers(): Promise<number> {
        try {
            return await this.usersRepository.count()
        } catch (error) {
            console.log(error); 
        }
    }

    generateSex(num: number): string {
        return num >= 0.5 ? 'м' : 'ж';
    }

    generateProblem(num: number): boolean {
        return num >= 0.5 ? true : false;
    }

    generateName(length: number): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя';        
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
            counter += 1;
        }
        return result;
    }
}
