/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import { test, allPass, compose, length, ifElse, curry, andThen } from 'ramda';
import Api from '../tools/api';
import * as R from 'ramda';
import { prop } from 'ramda';

const api = new Api();

const isNumber = test(/^\d+$/);
const isLengthLessThan10 = compose(R.lt(R.__, 10), R.length);
const isLengthGreaterThan2 = compose(R.gt(R.__, 2), R.length);
const isPositive = compose(R.lt(0), parseFloat);

const validateNumber = allPass([isNumber, isLengthLessThan10, isLengthGreaterThan2, isPositive]);

const toNumber = R.pipe(parseFloat, Math.round);

const convertToBinaryParams = (number) => ({
  from: 10,
  to: 2,
  number,
});

const fetchBinaryNumber = (number) =>
  api.get('https://api.tech/numbers/base', convertToBinaryParams(number))
    .then(prop('result'));

const fetchAnimalName = (id) =>
  api.get(`https://animals.tech/${id}`, '')
    .then(prop('result'));

const curryWriteLog = curry((logFn, value) => {
  logFn(value);
  return value;
});

const square = (num) => num * num;

const remainderOfDivisionBy3 = (num) => num % 3;

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const log = curryWriteLog(writeLog);

  const handleValidationError = () => handleError('ValidationError');

  const logAndProcess = compose(
    andThen(handleSuccess),
    fetchAnimalName,
    log,
    remainderOfDivisionBy3,
    log,
    square,
    log,
    length,
    log
  )

  const processValidNumber = compose(
    andThen(
      logAndProcess
    ),
    fetchBinaryNumber,
    log,
    toNumber
  );

  const processValue = compose(
    ifElse(validateNumber, processValidNumber, handleValidationError),
    log
  );

  processValue(value);
}

export default processSequence;
