import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../../../Common/application/use-case';
import {
  AssetsRepository,
  assetsRepositoryProvider,
} from '../../repositories/assets.repository';

@Injectable()
class AssetsImagePostUseCase implements UseCase<File, string> {
  private readonly _assetsRepository: AssetsRepository =
    inject(AssetsRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(image: File): Observable<string> {
    return this._assetsRepository.postImage(image);
  }
}

const AssetsImagePostProviders = [
  assetsRepositoryProvider,
  AssetsImagePostUseCase,
];
export { AssetsImagePostUseCase, AssetsImagePostProviders };
