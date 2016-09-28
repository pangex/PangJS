// JScript File

//----------------------------------------------------------------------------------
// funzione che gestisce l'analisi dei file xml e crea la tabella dei risultati
//----------------------------------------------------------------------------------
// tipogriglia: 1-griglia da collezione con tante thumb
//				2-griglia da scambio
// urlXml: 		dove si trova il file xml da esaminare
// elementTag:	il tag dell'elemento principale del file xml
// listaFiltri:	stringa contenente i nomi degli atribute su cui posso filtrare
// topTag:		nome del tag descrittivo alto

function XmlReader(tipoGriglia,urlXml,elementTag,listaFiltri,topTag)
{   
    //alert(base);    
    //alert(document.getElementsByName("hidFiltri").value);    
    var filtri;
    var nroCol = calcolaColonne();
    filtri = listaFiltri.split(",");
	$.ajax(
	{
		type: "GET",
		url: urlXml,
		dataType: "xml",
		success: function(xml)
		{
            var QrStr="";
            if (tipoGriglia !=4) QrStr = AnalizzaQS();
            //alert(QrStr.length);
			var select = "";     // = $('#ConTabella');
			var strHtml;
			var cont = 1;
			var contTot = 0;
			
			//alert('nro filtri:' + filtri.length);
			//alert(filtri[filtri.length-1]);
			//alert(QrStr[filtri[filtri.length-1]]);
			switch (tipoGriglia) 
			{
				case 1: //griglia di tipo collection
					var pagina = 0;
					pagina = estraiDatiPaginazione('pag');
					var imgXpag = 0;
					imgXpag = estraiDatiPaginazione('ixp');
					//alert(imgXpag);
					var indiceIniziale = imgXpag * (pagina-1) ;		
					var indiceFinale = indiceIniziale - (- imgXpag);		
				    //alert(indiceIniziale);
				  	var nodeElem = [];
					var elements = $(xml).find(elementTag);
					var larghColonne = '15%';
					//alert(elements.length);
					
					//elements.sort(CompareForSort);
					//alert(elements.length);					
					elements.each(function(ind)
					{  
				    	var filtroOk =1;
					    if ((QrStr.length >0))
					    {
					        for (ii= 0; ii < filtri.length; ii++)
					        {
					            var nomFiltro = filtri[ii];
					    	    var valFiltro = QrStr[nomFiltro];
					            var valAttribute ='';
		    			    	
		                        if (valFiltro != '')
					            {
					            	//alert(nomFiltro);
					            	//alert(valFiltro );
					            	switch(nomFiltro)
					            	{
					            		case 'ref':
						            		valAttribute= $(this).attr(nomFiltro).toString();
							                if (valAttribute.toLowerCase().indexOf(valFiltro.toLowerCase()) == -1)  			            
							                {   
							                    filtroOk = 0;
							                    ii = filtri.length;
							                }
											break;
											
					            		case 'desc':
						            		valAttribute=$(this).text();
						                	//alert('filtro desc');
						                	if (valAttribute.toLowerCase().indexOf(valFiltro.toLowerCase()) == -1)
						                	{
										        filtroOk = 0;
							                    ii = filtri.length;
						                	}
											break;
											
					            		default:
					            			try
					            			{
											valAttribute= $(this).attr(nomFiltro).toString();
							                if (valFiltro != valAttribute)  			            
							                {   
							                    filtroOk = 0;
							                    ii = filtri.length;
							                }
							                }
							                catch(e)
							                {	alert(ii);
							                	alert($(this).text());
							                }	            		
					            	}
					            }
					        }
		                }
						if (filtroOk == 1 && $(this).attr(topTag) != '') nodeElem.push($(this));			            					
					}); //end each function	              
					
				    select = " <table class='Tabella'> ";
				    if (indiceFinale == 0) indiceFinale = nodeElem.length;
					else indiceFinale = Math.min(indiceFinale ,nodeElem.length);		  
				  	//alert(indiceIniziale +'-'+indiceFinale );				
					for (jj = indiceIniziale ; jj < indiceFinale  ; jj++)
			    	{

			//		    if (filtroOk == 1 && $(this).attr(topTag) != '') 
			//            {		
		                var desc = nodeElem[jj].text();
	                    var idDivNascosto = '';
	                    idDivNascosto = nodeElem[jj].attr(topTag) + nodeElem[jj].attr('vers') + nodeElem[jj].attr('ordref');
	                    var thumbLink = nodeElem[jj].attr('thumb');
	                    var thumbLink2 = nodeElem[jj].attr('thumb2');
	                    if (cont == 1)
	                    {
	                        select = select + "<tr class='RigaColl'>";
	                    }
	                    select = select + ("<td class='CellaColl' align='Center'  width='" + larghColonne +"' > ");
	                    select = select + ("<BR />");
	                    select = select + ("<p> Ref " + nodeElem[jj].attr(topTag) + "</p>");
	                    select = select + ("<a href='javascript:mostraImg(\"" + nodeElem[jj].attr('image') + "\")'>");	                    
	                    if (thumbLink2 == null || thumbLink2 == "") 
	                    	select = select + ("<img alt='Ref " + nodeElem[jj].attr(topTag) + "' src='" + thumbLink  + "' height='120px' width='160px'>");
	                    else 										
	                    	select = select + ("<img onmouseover='this.src=\"" +thumbLink2+"\"' onmouseout='this.src=\"" + thumbLink +"\"'  alt='Ref " + $(this).attr(topTag) + "' src='" + thumbLink  + "' height='120px' width='160px'>");					
	                    select = select + ("</a>");
	                                     
	                    select = select + ("<BR />");
	                    select = select + ("<p>" + desc.replace("**", "<BR />") + "</p>");
	                    select = select + ("<BR />");
	                    select = select + ("</td>");
	
	                    if ( (cont == nroCol)  ) 
	                    {   select = select + ("</tr>");
	                        cont = 0;
	                    }
	                    cont = cont + 1;
	                    contTot = contTot +1;
	                }             

					popolaComboPagine(contaPagine(nodeElem.length,imgXpag));
					break;
												
				case 2:	//griglia di tipo scambio/vendita
				
					
					var nroColonne = 1;
					var larghColonne = '15%';
					var cont = 0;
				
				    select = " <table class='Tabella' cellspacing='0' cellpadding='2'> ";
					$(xml).find(elementTag).each(function()
					{   
					    var filtroOk = 1;
					    if (cont== 0)
					    {
					// conteggio quante immagini ho per riga
							for (var iii=2; iii < 6;iii++)
							{
								var sngAtt;
								//alert(elements[0].text());
								sngAtt = $(this).attr('thumb' + (iii+''))
								if (sngAtt == null || sngAtt == '' ) iii=6;
								else nroColonne = iii;
							}
							//alert(nroColonne);
							switch(nroColonne)
							{
								case 1:
									larghColonne = '40%'
									break;
								case 2:
									larghColonne = '30%'
									break;
								case 3:
									larghColonne = '20%'
									break;
								case 4:
									larghColonne = '17%'
									break;
								case 5:
									larghColonne = '14%'
									break;
								case 6:
									larghColonne = '12%'
							}					    
					    }
					    cont = cont +1;
    					//alert(larghColonne);

					    if (QrStr.length >0)
					    {
					        for (ii= 0; ii < filtri.length; ii++)
					        {
					            var nomFiltro = filtri[ii];
					    	    var valFiltro = QrStr[nomFiltro];
					            var valAttribute = $(this).attr(nomFiltro).toString();
	
		                        if (valFiltro != '')	// && valFiltro != 'undefined')
					            {
					                //alert('enrtato');
					                if (valFiltro != valAttribute)  			            
					                {   
					                    filtroOk = 0;
					                    ii = filtri.length;
					                }
					                //else alert('filtro uguale');
					            }
					            //else alert('nonEntratoInFiltro');
					        }
		                }
					    if (filtroOk == 1	 && $(this).attr(topTag) != '') 
			            {		
			                var desc = $(this).text();
		                    //if (cont == 1)
		                    //{
		                    select = select + "<tr class='RigaSca'>";
		                    //}
		                    for (qq = 1; qq<=nroColonne; qq++)
		                    {
		                    	var pos;
		                    	if ($(this).attr('pos'+qq.toString()) == null) pos='O';
		                    	else pos=$(this).attr('pos'+qq.toString());
		                    	var dimThumb;
		                    	if (pos=='O') dimThumb = "height='120px' width='160px'";
		                    	else dimThumb ="height='160px' width='120px'";
		                    	
			                 	if (qq==1) select = select + ("<td class='CellaScaLeft' align='Center'  width='"+larghColonne+"' > ");
			                 	else select = select + ("<td class='CellaScaCenter' align='Center'  width='"+larghColonne+"' > ");
			                 	if ($(this).attr('image'+qq.toString()) != null && $(this).attr('image'+qq.toString()) != '')
			                    {
				                    select = select + ("<BR />");
				                    //alert('image'+qq.toString()+'-');
				                    //select = select + ("<a href='" + $(this).attr('image'+qq.toString()) + "' target='_blank'>");
				                   // select = select + ("<a href='MostraImg.html?img=" + $(this).attr('image'+qq.toString()) + "' target='_blank'>");
				                    select = select + ("<a href='javascript:mostraImg(\"" + $(this).attr('image'+qq.toString()) + "\")'>");				                   
				                    //select = select + ("<a href='javascript:window.open(""MostraImg.html"", """ + $(this).attr('image'+qq.toString() ) + """, ""menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes"")'>");
				                    select = select + ("<img alt='Ref " + $(this).attr(topTag) + "' src='" + $(this).attr('thumb'+qq.toString()) + "' "+dimThumb +"/>");
				                    select = select + ("</a>");
				                    select = select + ("<p><BR /></p>");
			                    }
			                    select = select + ("</td>");
			                }
			                select = select + ("<td class='CellaScaRight' align='Center'  width='"+larghColonne+"' > ");
					        select = select + ("<p> Ref " + $(this).attr(topTag) + "</p>");
			                select = select + ("<p>" + sostChar(desc, "**", "<BR />") + "</p>");
			                //select = select + ("<p>" + desc.replace("**", "<BR />").replace("**", "<BR />").replace("**", "<BR />").replace("**", "<BR />") + "</p>");
			                //select = select + ("<BR />");
			                //select = select + ("<p>&nbsp;</p>");
			                select = select + ("</td>");
	
		
		                    //if ( (cont == nroCol)  ) 
		                    //{
		                        select = select + ("</tr>");
		                    //    cont = 0;
		                    //}
		                    cont = cont + 1;
		                    contTot = contTot +1;
		                }             
	//	                else alert('no');
					}); //end each function
					break;
				case 3:		//griglia di tipo novità

				    select = " <table class='Tabella' cellspacing='0' cellpadding='2'> ";
					$(xml).find(elementTag).each(function()
					{
	                 	if ($(this).attr('data') != null && $(this).attr('data') != '')
	                    {
			                var desc = $(this).text();
		                    select = select + "<tr class='RigaNews'>";
		                    select = select + ("<td class='CellaNewsLeft' align='Center'  width='15%' > ");
		                    select = select + $(this).attr('data') + '</td>';
		                    select = select + ("<td class='CellaNewsRight' align='Left'  width='85%' > ");
							select = select + desc  + '</td>';
	                    }
                        select = select + ("</tr>");
	                    cont = cont + 1;
	                    contTot = contTot +1;
					}); //end each function
					break;
				case 4: //griglia di tipo Ultimi Arrivi
					select = " <table class='Tabella' cellspacing='0' cellpadding='2'> ";
					//var nodeElem = [];
					var nodeElem = $(xml).find(elementTag);
					var larghColonne = '15%';
					nodeElem.sort(CompareForSort);
					//alert('in');
					switch(nroCol)
							{
							case 1:
								larghColonne = '40%'
								break;
							case 2:
								larghColonne = '30%'
								break;
							case 3:
								larghColonne = '20%'
								break;
							case 4:
								larghColonne = '17%'
								break;
							case 5:
								larghColonne = '14%'
								break;
							case 6:
								larghColonne = '12%'
							}					    

					var jj;
					contTot = 0
					$(xml).find(elementTag).sort(CompareForSort).each(function()
					{
						if (contTot < 60)			        
					    {   var desc =  $(this).text();
		                    var idDivNascosto = '';
		                    idDivNascosto = $(this).attr(topTag) + $(this).attr('vers') + $(this).attr('ordref');
		                    var thumbLink = $(this).attr('thumb');
		                    var thumbLink2 = $(this).attr('thumb2');
		                    if (cont == 1)
		                    {
		                        select = select + "<tr class='RigaColl'>";
		                    }
		                    select = select + ("<td class='CellaColl' align='Center'  width='" + larghColonne +"' > ");
		                    select = select + ("<BR />");
		                    select = select + ("<p> Ref " + $(this).attr(topTag) + "</p>");
		                    //select = select + ("<a href='MostraImg.html?img=" + $(this).attr('image') + "' target='_blank'>");
		                    select = select + ("<a href='javascript:mostraImg(\"" + $(this).attr('image') + "\")' title='Inserito il " +datizza($(this).attr('datains')) + "'>");	                    
		                    //select = select + ("<a href='" + $(this).attr('image') + "' target='_blank'>");
		                    if (thumbLink2 == null || thumbLink2 == "") 
		                    {
		                    //alert("vuoto");
			                    select = select + ("<img alt='Ref " + $(this).attr(topTag) + "' src='" + thumbLink  + "' height='120px' width='160px'>");
		                    }
		                    else
		                    {
		                    //	alert(" non vuoto");
		                       	select = select + ("<img onmouseover='this.src=\"" +thumbLink2+"\"' onmouseout='this.src=\"" + thumbLink +"\"'  alt='Ref " + $(this).attr(topTag) + "' src='" + thumbLink  + "' height='120px' width='160px'>");
							}
		                    select = select + ("</a>");
		                                     
		                    select = select + ("<BR />");
		                    select = select + ("<p>" + desc.replace("**", "<BR />") + "</p>");
		                    select = select + ("<BR />");
		                    select = select + ("</td>");
		
		                    if ( (cont == nroCol)  ) 
		                    {   select = select + ("</tr>");
		                        cont = 0;
		                    }
		                    cont = cont + 1;
		                    contTot = contTot +1;
		                 //   if (contTot == 60) 
						}
					
					});
					break;
			}
			if (contTot == 0) select = "<div></div>";
			else select = select + ("</table>");
			//alert(select);
	        $('#ConTabella').append(select);
	        if (tipoGriglia != 3) $('#contTota').append(" (" + contTot.toString() + " elementi visualizzati)");
	        
        } // end success function
	});  // end ajax instruction
}

    
//----------------------------------------------------------------------------------    
// Read a page's GET URL variables and return them as an associative array.
//----------------------------------------------------------------------------------
//For example, if you have the URL:
//
//http://www.example.com/?me=myValue&name2=SomeOtherValue
//
//This code will return:
//{
//    "me"    : "myValue",
//    "name2" : "SomeOtherValue"
//}
//and you can do:
//
//var me = getUrlVars()["me"];
//var name2 = getUrlVars()["name2"];
//
// in più elimina le voci che hanno valore nullo
function AnalizzaQS()
{
 
    var vars = [], hash;
    //alert(document.getElementsByName("hidFiltri").value);
    if (document.getElementsByName("hidFiltri").value != "")
	{   
		try
		{
			var hashes = document.getElementsByName("hidFiltri").value.split('&');
        }
        catch(e)
        {
        	//alert('okkio');
        	hashes = '';
        }
        //alert(hashes.length);
        for(var i = 0; i < hashes.length; i++)
	    {
	    	//alert(hashes[i]);
	        hash = hashes[i].split('=');
            vars.push(hash[0]);
            if (hash.length == 1) vars[hash[0]]='';
            else vars[hash[0]] = hash[1];
	       // }
	    }
    }
    //alert(vars.length);
    return vars;
}

function estraiDatiPaginazione(tipoDato)
// tipoDato vale 'ixp' se voglio il numero di immagini per pagina
//			vale 'pag' se voglio il numero di pagina
{
	var vars = [], hash;
	var result = 0;
	var hashes;
	/* messo catch, perchè a volte non riesce a prendere il valore della textbox, ma succede solo quando cambio pagina dal menù
		quindi ipotizzo di rimettere le condizioni iniziali  */
	try
	{
		hashes  = document.getElementsByName("hidPaginazione").value.split('&');
	}
	catch(e)
	{
		hashes = defaultQS.split('&');
		//alert('razzo');
	}
	hash = hashes[0].split('=');
	if (hash[0] == tipoDato) result=hash[1];
	hash = hashes[1].split('=');
	if (hash[0] == tipoDato) result=hash[1];
	return result;
}

function calcolaColonne()
{
    var inWidth;
    inWidth = window.innerWidth;
    if (inWidth >= 1160) return (6);
    else if (inWidth >= 930) return(5);
            else return(4);
}

function contaPagine(totEl, imgXpag)
{
	var npag = 1;
	if (imgXpag > 0 )
	{
		var npag = (totEl/imgXpag).toString();
		if (npag.indexOf('.') != -1) npag = npag.split('.')[0] - (-1);
	}
	return npag;
}

function popolaComboPagine(npag)
{
	var opt = null;
	var a=0;
	while (opt == null)
	{
		a=a+1;
		opt = document.getElementById('optPagina');
	}
	//if (a >1) alert('achtung: '+a);
	
	var optLength = opt.options.length;
	//alert(optLength  +'-'+npag);
	if (optLength  < npag)
	{
		for (ii = optLength  ; ii < npag; ii++)
		{
			opt.options[ii] = new Option(paddaNumeri((ii-(-1)).toString(),2), ii-(-1));
		}
	}
	else
	{
		if (optLength  > npag);
		{			
			for (ii = npag ; ii <= optLength  ; ii++)
			{
				opt.options[npag] = null;	
			}
		}
	}
}

function paddaNumeri(str, lunghezza)
{
	str = '000'+str;
	return str.substr(str.length-lunghezza);
}

function CompareForSort(first, second)
{	// ordinamento decrescente

    if (first.getAttribute('datains').toString() == second.getAttribute('datains').toString())
    {
        return 0;
    }
    if (first.getAttribute('datains').toString() > second.getAttribute('datains').toString())
        return -1;
    else
        return 1; 
}

function datizza(data)
{
	return data.substring(6) + '/' + data.substring(4,6) + '/' + data.substring(0,4)
}