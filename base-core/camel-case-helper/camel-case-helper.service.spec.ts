import { CamelCaseHelperService } from './camel-case-helper.service';

fdescribe('CamelCaseHelperService', () => {
  let service: CamelCaseHelperService;

  let result: any;

  let expectedResult: any;

  beforeEach(() => {
    service = new CamelCaseHelperService();
  });

  afterEach((): void => {
    service = null!;

    result = null;

    expectedResult = null;
  });

  describe('toSnakeCase', (): void => {
    it('should convert camel case to snake case(1 word)',(): void => {
      expectedResult = 'snake';

      result = service.toSnakeCase('snake');

      expect(result).toEqual(expectedResult);
    });

    it('should convert camel case to snake case(2 words)',(): void => {
      expectedResult = 'snake_case';

      result = service.toSnakeCase('snakeCase');

      expect(result).toEqual(expectedResult);
    });

    it('should convert camel case to snake case(3 words)',(): void => {
      expectedResult = 'snake_case_three';

      result = service.toSnakeCase('snakeCaseThree');

      expect(result).toEqual(expectedResult);
    });
  });
});
