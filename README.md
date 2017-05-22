# Code Institute - Stream 2 Project  [Demo](https://femicidios.herokuapp.com/)

## Gender Violence Data Visualization 

## Technologies used :

<img src="https://camo.githubusercontent.com/904ade21b6fb63dec17555495bb36f749ba52023/68747470733a2f2f73332d75732d776573742d322e616d617a6f6e6177732e636f6d2f706c7567696e7365727665722f646f635265736f75726365732f737461636b2e737667" width="350px">

## And:

- [Python](https://www.python.org)
- [Flask](flask.pocoo.org)
- [Jinja2](jinja.pocoo.org)
- [D3](https://d3js.org)
- [DC](https://dc-js.github.io/dc.js)
- [Crossfilter](https://square.github.io/crossfilter)
- [Bootstrap](http://getbootstrap.com)
- [jQuery](http://jquery.com)
    
`all specifications & versions can be found on requirements.txt`


## Deployment

* Heroku
* mLab (DataBase)

## DataBase 

[National Dataset - Argentina](http://www.datos.gob.ar/dataset/registro-sistematizacin-y-seguimiento-de-femicidios-y-homicidios-agravados-por-el-gnero/archivo/1d44baba-b29a-452c-85b5-8ee47ccc2f10)


## Usage

The dashboard includes a Tutorial (on top right hand side) for visitors to guide them. Also the option to reset filters made back to 0 ("Quitar Filtros").

```
   var all = ndx.groupAll();
```

Diferent types of graphics such as .piechart for Gender Type (Segun Identidad de Genero), .numberDisplay for the Total of Complaints (Numero de Denuncias) or .lineChart for the amount of complaints made through the years (Denuncias por fecha) wich also inculdes a .selecMenu to filter a particular full-year. All these chosen to show the best way to understeand the data.


