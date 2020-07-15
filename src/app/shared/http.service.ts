import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Task } from '../models/task.model';

@Injectable()
export class HttpService {

  tasks: Task[] = [];

  constructor(private http: Http) { }

  getTasks(): Observable<Task[]> {
    return this.http.get('https://tasksmanager-302f5.firebaseio.com/Task.json').pipe(
      map((response: Response) => {
        const taskList = response.json();
        const tempTasksArray = [];
        
        if(taskList && Object.keys(taskList) && Object.keys(taskList).length) {
          Object.keys(taskList).map(function (key) {
            taskList[key].name = key;
            tempTasksArray.push(taskList[key] );
            return tempTasksArray;
          });
        } 

        return tempTasksArray;
      })
    );
  }

  getTaskByName(name: string): Observable<Task> {
    return this.http.get('https://tasksmanager-302f5.firebaseio.com/Task/' + name + '.json').pipe(
      map(
        (response: Response) => {
          const data = response.json();

          const task: Task = {
            name: name,
            priority: data.priority,
            description: data.description,
            id: data.id,
            status: data.status
          };
          return task;
        }
      )
    );
  }

  updateTask(name: string, task: Task): Observable<any> {
    return this.http.patch('https://tasksmanager-302f5.firebaseio.com/Task/' + name + '.json', task);
  }

  deleteTask(name: string): Observable<any> {
    return this.http.delete('https://tasksmanager-302f5.firebaseio.com/Task/' + name + '.json');
  }

  addTask(task: Task): Observable<any> {
    return this.http.post('https://tasksmanager-302f5.firebaseio.com/Task.json', task);
  }

}