import { FormErrorsPipe } from './form-errors.pipe';

describe('FormErrorsPipe', () => {
  it('create an instance', () => {
    const pipe = new FormErrorsPipe(null!, null!);
    expect(pipe).toBeTruthy();
  });
});
