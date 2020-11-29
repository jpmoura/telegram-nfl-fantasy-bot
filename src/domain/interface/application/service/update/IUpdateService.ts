import News from '../../../../model/News';

export default interface IUpdateService {
  update(moment: Date): Promise<Array<News>>
}
