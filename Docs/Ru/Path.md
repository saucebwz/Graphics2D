Graphics2D.Path
===================

`Graphics2D.Path` - путь.

### Создание
```js
// points, x, y, fill, stroke
ctx.path('M10,10 L200,200 z', 10, 10, null, '15px blue');

ctx.path({
	points: 'M10,10', // это не совсем svg
	x:200,
	y:200
});


// кроме того, можно передавать точки так:
ctx.path([[10, 10], [100,100], [200,200,200,200]]);
// 1 - moveTo, остальные: 2 параметра - lineTo, 4 - quadratic, 6 - bezier

ctx.path([{f:'moveTo', arg:[10,10]}, {f:'lineTo', x:200, y:200}]);
// можно передать массив аргументов, или же параметры отдельно

ctx.path()
	.moveTo(10,10)
	.lineTo(200,200); // или даже так
```

### Методы
#### x / y
```
path.x(); // -> 10
path.x(200);
```
С параметром - устанавливают, без - возвращают.

#### closed
Закрыт или открыт путь (также он может быть закрыт внутри переданной closePath, тогда не регулируется).
```js
path.closed(); // -> false
path.closed(true);
```

#### close
Просто закрывает.

#### allPoints([func])
Возвращает все точки фигуры (например, у bezier - 3 точки), либо - если передана функция - работает как [].map. Может возвратить новые координаты (тогда координаты будут изменены), либо false - тогда ничего не будет.
```js
path.allPoints(); // -> [[0,0], [10,10], ...]
path.allPoints(function(x, y){
  if(x < 0 && y < 0)
    return false; // если точка < [0,0], то ничего не делаем
  return [x + 10, y + 10]; // все остальные точки сдвигаем на 10,10
});
```

#### transformPoints
Трансформирует путь. Отличие от `transform` в том, что изменяются координаты точек (а в `transform` происходит постизменение, т.е. изменение координат точек после трансформации там подвержено ей же, а здесь - нет).
```js
var p = ctx.path('M10,10 L200,200');
p.point(0); // moveTo 10 10

p.rotate(90);
p.point(0); // moveTo 10 10
// фигура повернулась, однако (!) координаты всё те же

p.transformPoints('rotate', 90);
p.point(0); // moveTo 200 10
```
Доступны следующие варианты использования:
- `'translate', x, y`
- `'scale', x, y, pivot`
- `'scale', size, pivot`
- `'rotate', angle, pivot`
- `'skew', x, y, pivot`
- `'skew', size, pivot`
- `m11, m12, m21, m22, dx, dy`

`pivot` - центр трансформации (напр. центр вращения), можно указывать как и в обычных функциях трансформации (`top left`, `[10,10]` и т.д.).

В `skew` и `rotate` - градусы.

### Функции рисования
*Примечание: немного нарушен стандартный порядок параметров `quadratic` и `bezier`. Например, если в обычном canvas - `hx, hy, x, y`, то здесь `x, y, hx, hy`.*
##### moveTo(x, y)
##### lineTo(x, y)
##### quadraticCurveTo(x, y, hx, hy)
##### bezierCurveTo(x, y, h1x, h1y, h2x, h2y)
##### arcTo(x1, y1, x2, y2, radius, clockwise)
##### arc(x, y, radius, start, end, clockwise)

#### point(index, [value])
Без параметра - возвращает точку с индексом index. С параметром - устанавливает (можно передать сразу несколько).
```js
var p = ctx.path('M10,10 L200,200');

p.point(0); // -> { f:'moveTo', arg:[10,10], x:10, y:10 }
p.point(1); // -> { f:'lineTo', arg:[200,200], x:200, y:200 }

p.point(1, 'L100,100 L100,200'); // меняем одну точку на сразу несколько
p.point(1); // lineTo 100 100
p.point(2); // lineTo 100 200
```

#### points([value])
Сразу все точки.
```js
p.points(); // -> [{f:'moveTo', ...}, {f:'lineTo', ...}]
p.points('M0,0 L0,100');
p.points([ [10,10], [200,200] ])
```

#### before(index, point)
Вставляет новые точки перед точкой с индексом index.
```js
var p = ctx.path('M10,10 L0,0');
p.before(1, 'L0,10');
// M10,10 L0,10 L0,0
```

#### after(index, point)
После.

#### remove([index]);
Переопределённая унаследованная от `Shape` функция: если мы передаём индекс точки - удаляет её, ничего не передаём - всё также удаляет всю фигуру.