/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { anyPass } from "ramda";
import { allPass } from "ramda";
import { equals } from "ramda";

const isWhite = equals('white');
const isRed = equals('red');
const isGreen = equals('green');
const isBlue = equals('blue');
const isOrange = equals('orange');

const isRedStar = ({ star }) => isRed(star);

const isWhiteTriangle = ({ triangle }) => isWhite(triangle);
const isWhiteCircle = ({ circle }) => isWhite(circle);

const isGreenStar = ({ star }) => isGreen(star);
const isGreenSquare = ({ square }) => isGreen(square);
const isGreenTriangle = ({ triangle }) => isGreen(triangle);
const isGreenCircle = ({ circle }) => isGreen(circle);

const isOrangeSquare = ({ square }) => isOrange(square);
const isOrangeTriangle = ({ triangle }) => isOrange(triangle);
const isOrangeCircle = ({ circle }) => isOrange(circle);
const isOrangeStar = ({ star }) => isOrange(star);

const isBlueCircle = ({ circle }) => isBlue(circle);

const countColor = (color, obj) => Object.values(obj).filter(equals(color)).length;

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([isRedStar, isGreenSquare, isWhiteTriangle, isWhiteCircle]);

// 2. Как минимум две фигуры зеленые.

const greenStarAndSquare = allPass([isGreenStar, isGreenSquare]);
const greenStarAndTriangle = allPass([isGreenStar, isGreenTriangle]);
const greenStarAndCircle = allPass([isGreenStar, isGreenCircle]);
const greenSquareAndTriangle = allPass([isGreenSquare, isGreenTriangle]);
const greenSquareAndCircle = allPass([isGreenSquare, isGreenCircle]);
const greenTriangleAndCircle = allPass([isGreenTriangle, isGreenCircle]);

export const validateFieldN2 = anyPass([
  greenStarAndSquare,
  greenStarAndTriangle,
  greenStarAndCircle,
  greenSquareAndTriangle,
  greenSquareAndCircle,
  greenTriangleAndCircle
]);

// 3. Количество красных фигур равно кол-ву синих.
const equalRedAndBlue = (shapes) => countColor('red', shapes) === countColor('blue', shapes);

export const validateFieldN3 = allPass([equalRedAndBlue]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([isBlueCircle, isRedStar, isOrangeSquare]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
const hasThreeRed = (shapes) => countColor('red', shapes) >= 3;
const hasThreeGreen = (shapes) => countColor('green', shapes) >= 3;
const hasThreeBlue = (shapes) => countColor('blue', shapes) >= 3;
const hasThreeOrange = (shapes) => countColor('orange', shapes) >= 3;

export const validateFieldN5 = anyPass([hasThreeRed, hasThreeGreen, hasThreeBlue, hasThreeOrange]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
const hasGreenTriangle = ({ triangle }) => isGreen(triangle);
const hasTwoGreens = (shapes) => countColor('green', shapes) === 2;
const hasOneRed = (shapes) => countColor('red', shapes) === 1;

export const validateFieldN6 = allPass([hasGreenTriangle, hasTwoGreens, hasOneRed]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allPass([isOrangeSquare, isOrangeStar, isOrangeTriangle, isOrangeCircle]);

// 8. Не красная и не белая звезда, остальные – любого цвета.
const isNotRedStar = ({ star }) => !isRed(star);
const isNotWhiteStar = ({ star }) => !isWhite(star);

export const validateFieldN8 = allPass([isNotRedStar, isNotWhiteStar]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = allPass([isGreenStar, isGreenSquare, isGreenTriangle, isGreenCircle]);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
const triangleAndSquareSameColor = ({ triangle, square }) => triangle === square;
const triangleNotWhite = ({ triangle }) => !isWhite(triangle);
const squareNotWhite = ({ square }) => !isWhite(square);

export const validateFieldN10 = allPass([triangleAndSquareSameColor, triangleNotWhite, squareNotWhite])
