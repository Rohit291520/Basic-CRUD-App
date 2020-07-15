import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { HttpService } from '../shared/http.service';
import * as TaskModel from '../models/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  task: TaskModel.Task;
  tasks: TaskModel.Task[] = [];
  taskForm: FormGroup;
  showTaskForm = false;
  isEdit = false;
  message = null;
  priorities: String[] = [TaskModel.HIGH, TaskModel.MEDIUM, TaskModel.LOW];
  statuses: String[] = [TaskModel.STARTED, TaskModel.NOT_STARTED];


  constructor(private httpService: HttpService, private fb: FormBuilder) { }

  ngOnInit() {
    this.task = new TaskModel.Task();
    this.httpService.getTasks().subscribe(
      (tasks: TaskModel.Task[]) =>  this.tasks = tasks
    );
  }

  onDelete(name: string) {
    confirm('Do you want to delete the task?');
    this.httpService.deleteTask( name ).subscribe(
      (response: Response) => {

        this.showTransactionMessage('Deleted successfully!');
        this.httpService.getTasks().subscribe(
          (tasks: TaskModel.Task[]) => this.tasks = tasks
        );
      },
      (error) => this.showTransactionMessage(error)
    );
  }

  onUpdate(name: string) {
    this.httpService.getTaskByName(name).subscribe(
      (taskData: TaskModel.Task) => {
        this.task = taskData;
        this.onAddTaskRow();

        this.taskForm.patchValue(this.task);
        this.isEdit = true;
      }
    );
  }

  onAddTaskRow() {
    this.taskForm = this.buildForm();
    this.showTaskForm = true;
    this.isEdit = false;
  }

  buildForm() {
    return this.fb.group({
      'status': this.fb.control(null, [Validators.required]),
      'description': this.fb.control(null, [Validators.required]),
      'priority': this.fb.control(null, [Validators.required]),
      'id': this.fb.control(Math.floor(Math.random() * 100), [Validators.required]),
    });
  }
 
  onSubmit() {
    this.task.status = this.taskForm.get('status').value;
    this.task.priority = this.taskForm.get('priority').value;
    this.task.id = this.taskForm.get('id').value;
    this.task.description = this.taskForm.get('description').value;

    let transactionObservable = this.httpService.addTask( this.task );
    if ( this.isEdit ) {
      transactionObservable = this.httpService.updateTask( this.task.name, this.task );
    }

    transactionObservable.subscribe(
      (response: Response) => {
        this.showTaskForm = false;
        this.taskForm = null;
        this.isEdit = false;

        this.showTransactionMessage('Added/Updated successfully!');
        this.httpService.getTasks().subscribe(
          (tasks: TaskModel.Task[]) => this.tasks = tasks
        );
      },
      (error) => this.showTransactionMessage(error)
    );
  }

  showTransactionMessage( message: string ) {
    this.message = message;
    setTimeout(
      () => this.message = null,
      3000
    );
  }

}
