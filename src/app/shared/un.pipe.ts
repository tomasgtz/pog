import { Pipe, PipeTransform } from '@angular/core';

import { Order } from './order.model';

@Pipe({ name: 'SOControl',pure: true })
export class SOControlPipe implements PipeTransform {
  transform(allSO: Order[]) {
    
    return allSO.filter(order => order.unidad_de_negocio_c === 'control')
    
  }
}

@Pipe({ name: 'SOCMH',pure: false })
export class SOCMHPipe implements PipeTransform {
  transform(allSO: Order[]) {
    return allSO.filter(order => order.unidad_de_negocio_c === 'cmh');
  }
}

@Pipe({ name: 'SOSS',pure: false })
export class SOSSPipe implements PipeTransform {
  transform(allSO: Order[]) {
    return allSO.filter(order => order.unidad_de_negocio_c === 'ss');
  }
}

@Pipe({ name: 'SOEOL',pure: false })
export class SOEOLPipe implements PipeTransform {
  transform(allSO: Order[]) {
    return allSO.filter(order => order.unidad_de_negocio_c === 'eol');
  }
}