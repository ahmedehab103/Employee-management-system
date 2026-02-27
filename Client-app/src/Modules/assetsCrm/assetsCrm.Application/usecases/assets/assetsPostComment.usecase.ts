import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../../../Common/application/use-case';
import {
  AssetsRepository,
  assetsRepositoryProvider,
} from '../../repositories/assets.repository';

@Injectable()
class AssetsPostCommentUseCase
  implements UseCase<{ assetId: string; comment: string }, string>
{
  private readonly _assetsRepository: AssetsRepository =
    inject(AssetsRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(data: { assetId: string; comment: string }): Observable<string> {
    return this._assetsRepository.postComment(data);
  }
}

const AssetsPostCommentProviders = [
  assetsRepositoryProvider,
  AssetsPostCommentUseCase,
];
export { AssetsPostCommentUseCase, AssetsPostCommentProviders };
