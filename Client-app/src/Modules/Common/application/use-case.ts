import { Observable } from 'rxjs';

export interface UseCase<I, O> {
  execute(params: I): Observable<O>;
}
export interface UseCaseWithOutInPut<O> {
  execute(): Observable<O>;
}

export interface UseCaseWithOutOutPut<I> {
  execute(params: I): Observable<object>;
}
