import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'allowed',pure: false })
export class USERAllowedPipe implements PipeTransform {
  transform(allUsers: any[]) {
    
    return allUsers.filter(user => user.allowed === "1")
    
  }
}

@Pipe({ name: 'notallowed',pure: false })
export class USERNotAllowedPipe implements PipeTransform {
  transform(allUsers: any[]) {
    
    return allUsers.filter(user => user.allowed === "0")
    
  }
}
