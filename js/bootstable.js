/*
Bootstable
 @description  Javascript library to make HMTL tables editable, using Bootstrap
 @version 1.1
 @autor Tito Hinostroza
*/
"use strict";
//Global variables
var params = null;  		//Parameters
var colsEdi =null;
var newColHtml = '<div class="btn-group pull-right">'+
'<button id="bEdit" type="button" class="btn btn-sm btn-default" onclick="rowEdit(this);">' +
'<span class="glyphicon glyphicon-pencil" ><i class="fa fa-edit"></i></span>'+
'</button>'+
'<button id="bElim" type="button" class="btn btn-sm btn-default" onclick="rowElim(this);">' +
'<span class="glyphicon glyphicon-trash" > <i class="fa fa-trash"></i></span>'+
'</button>'+
'<button id="bAcep" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="rowAcep(this);">' +
'<span class="glyphicon glyphicon-ok" ><i class="fa fa-check-square"></i> </span>'+
'</button>'+
'<button id="bCanc" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="rowCancel(this);">' +
'<span class="glyphicon glyphicon-remove" ><i class="fa fa-times"></i> </span>'+
'</button>'+
  '</div>';
var colEdicHtml = '<td name="buttons">'+newColHtml+'</td>';

$.fn.SetEditable = function (options) {
  var defaults = {
      columnsEd: null,         //Index to editable columns. If null all td editables. Ex.: "1,2,3,4,5"
      $addButton: null,        //Jquery object of "Add" button
      onEdit: function() {},   //Called after edition
      onBeforeDelete: function() {}, //Called before deletion
      onDelete: function() {}, //Called after deletion
      onAdd: function() {},     //Called when added a new row
      $addColButton : function() {}, //rowAddNewCol
      onAddCol : function() {} // Called after adding a column
  };
  params = $.extend(defaults, options);
  this.find('thead tr').append('<th name="buttons"></th>');  //empty header
  this.find('tbody tr').append(colEdicHtml);
  var $tabedi = this;   //Read reference to the current table, to resolve "this" here.
  //Process "addButton" parameter
  if (params.$addButton != null) {
      //Parameter provided
      params.$addButton.click(function() {
          rowAddNew($tabedi.attr("id"));
      });
  }

  if (params.$addColButton != null) {
      //Se proporcionó parámetro
      params.$addColButton.click(function() {
          rowAddNewCol($tabedi.attr("id"));
      });
  }



  //Process "columnsEd" parameter
  if (params.columnsEd != null) {
      //Extract felds
      colsEdi = params.columnsEd.split(',');
  }
};
function IterarCamposEdit($cols, tarea) {
//Iterates through the editable fields in a row
  var n = 0;
  $cols.each(function() {
      n++;
      if ($(this).attr('name')=='buttons') return;  //exclude button column
      if (!EsEditable(n-1)) return;   //noe s campo editable
      tarea($(this));
  });

  function EsEditable(idx) {
  //Indica si la columna pasada está configurada para ser editable
      if (colsEdi==null) {  //no se definió
          return true;  //todas son editable
      } else {  //hay filtro de campos
//alert('verificando: ' + idx);
          for (var i = 0; i < colsEdi.length; i++) {
            if (idx == colsEdi[i]) return true;
          }
          return false;  //no se encontró
      }
  }
}
function FijModoNormal(but) {
  $(but).parent().find('#bAcep').hide();
  $(but).parent().find('#bCanc').hide();
  $(but).parent().find('#bEdit').show();
  $(but).parent().find('#bElim').show();
  var $row = $(but).parents('tr');  //accede a la fila
  $row.attr('id', '');  //quita marca
}
function FijModoEdit(but) {
  $(but).parent().find('#bAcep').show();
  $(but).parent().find('#bCanc').show();
  $(but).parent().find('#bEdit').hide();
  $(but).parent().find('#bElim').hide();
  var $row = $(but).parents('tr');  //accede a la fila
  $row.attr('id', 'editing');  //indica que está en edición
}
function ModoEdicion($row) {
  if ($row.attr('id')=='editing') {
      return true;
  } else {
      return false;
  }
}
function rowAcep(but) {
//Accept edit changes

  var $row = $(but).parents('tr');  //access the row
  var $cols = $row.find('td');  //read fields
  if (!ModoEdicion($row)) return;  //It is already in edition
  //It is in edition. We have to finish the edition
  IterarCamposEdit($cols, function($td) {  //iterate through the columns
    var cont = $td.find('input').val(); //read input content
    $td.html(cont);  //pin content and remove controls
  });
  FijModoNormal(but);
  params.onEdit($row);
}
function rowCancel(but) {
//Reject edits changes
  var $row = $(but).parents('tr');  //access the row
  var $cols = $row.find('td');  //read fields
  if (!ModoEdicion($row)) return;  //It is already in edition
  //It is in edition. We have to finish the edition
  IterarCamposEdit($cols, function($td) {  //iterate through the columns
      var cont = $td.find('div').html(); //read div content
      $td.html(cont);  //pin content and remove controls
    });
  FijModoNormal(but);
}
function rowEdit(but) {  //Inicia la edición de una fila
  var $row = $(but).parents('tr');  //accede a la fila
  var $cols = $row.find('td');  //lee campos
  if (ModoEdicion($row)) return;  //Ya está en edición
  //Pone en modo de edición
  IterarCamposEdit($cols, function($td) {  //iterate through the columns
      var cont = $td.html(); //read content
      var div = '<div style="display: none;">' + cont + '</div>';  //save content
      var input = '<input class="form-control input-sm"  value="' + cont + '">';
      $td.html(div + input);  //fix content
  });
  FijModoEdit(but);
}
function rowElim(but) {  //Elimina la fila actual
  var $row = $(but).parents('tr');  //accede a la fila
  params.onBeforeDelete($row);
  $row.remove();
  params.onDelete();
}


function rowAddNew(tabId) {  //Agrega fila a la tabla indicada.
var $tab_en_edic = $("#" + tabId);  //Table to edit
  var $filas = $tab_en_edic.find('tbody tr');
  if ($filas.length==0) {
      //No hay filas de datos. Hay que crearlas completas
      var $row = $tab_en_edic.find('thead tr');  //encabezado
      var $cols = $row.find('th');  //lee campos
      //construye html
      var htmlDat = '';
      $cols.each(function() {
          if ($(this).attr('name')=='buttons') {
              //Es columna de botones
              htmlDat = htmlDat + colEdicHtml;  //agrega botones
          } else {
              htmlDat = htmlDat + '<td></td>';
          }
      });
      $tab_en_edic.find('tbody').append('<tr>'+htmlDat+'</tr>');
  } else {
      //Hay otras filas, podemos clonar la última fila, para copiar los botones
      var $ultFila = $tab_en_edic.find('tr:last');
      $ultFila.clone().appendTo($ultFila.parent());
      $ultFila = $tab_en_edic.find('tr:last');
      var $cols = $ultFila.find('td');  //lee campos
      $cols.each(function() {
          if ($(this).attr('name')=='buttons') {
              //Es columna de botones
          } else {
              $(this).html('');  //limpia contenido
          }
      });
  }
  params.onAdd();
}






function rowAddNewCol(tabId) {  //Agrega fila a la tabla indicada.
var $tab_en_edic = $("#" + tabId);  //Table to edit
  var $filas = $tab_en_edic.find('tbody tr');
  if ($filas.length==0) {
      //No hay filas de datos. Hay que crearlas completas

      alert('NO cols found');

      //var $row = $tab_en_edic.find('thead tr');  //encabezado
      //var $cols = $row.find('th');  //lee campos
      //construye html
      //var htmlDat = '';
      //$cols.each(function() {
      //    if ($(this).attr('name')=='buttons') {
      //        //Es columna de botones
      //        htmlDat = htmlDat + colEdicHtml;  //agrega botones
      //    } else {
      //        htmlDat = htmlDat + '<td></td>';
      //   }
      //});
      //$tab_en_edic.find('tbody').append('<tr>'+htmlDat+'</tr>');






  } else {
      //alert('Entrring COls Found Section cols found');
      //var $allrows = $filas.find('tr');
      $filas.each(function() {
          //alert('Entering cols'+$(this).html);
          //$(this).append('<td></td>');
          $(this).find('td:last').before('<td></td>');
      });
  }

  var $row = $tab_en_edic.find('thead tr');
  var $cols = $row.find('th');
  //$row.find('th').before('<th>Newly Added Coulmns</th>');


  // $row.find('th:last').before('<th>new added </th>');
  // $row.find('th:last-of-type').before('<th>new added </th>');
  //$('<th>new added </th>').insertBefore($row.find('th:last'))
  //$row.find('th').last().before('<th>new added </th>');



  var colname=prompt("Please enter column name","new column");
  if (colname!=null){
     var alertcolname = "Column  " + colname + "  will be created ";
     //alert(alertcolname);
  }
  else{
      colname = "new column";
  }


  $row.find('th:last').prev().before('<th>'+ colname + '</th>');

  //$row.find('th:last').prev().before('<th>new added </th>');



  //$( "<th> </th>" ).insertBefore($row.find('th'));
  //$cols.each(function() {
  //	if ($(this).attr('name')=='buttons') {
  //		//Es columna de botones
  //	} else {
  //		$(this).html('');  //limpia contenido
   //   }
  //});

  params.onAddCol();
}





function TableToCSV(tabId, separator) {  //Convierte tabla a CSV
  var datFil = '';
  var tmp = '';
  var $tab_en_edic = $("#" + tabId);  //Table source
  $tab_en_edic.find('tbody tr').each(function() {
      //Termina la edición si es que existe
      if (ModoEdicion($(this))) {
          $(this).find('#bAcep').click();  //acepta edición
      }
      var $cols = $(this).find('td');  //lee campos
      datFil = '';
      $cols.each(function() {
          if ($(this).attr('name')=='buttons') {
              //Es columna de botones
          } else {
              datFil = datFil + $(this).html() + separator;
          }
      });
      if (datFil!='') {
          datFil = datFil.substr(0, datFil.length-separator.length);
      }
      tmp = tmp + datFil + '\n';
  });
  return tmp;
}