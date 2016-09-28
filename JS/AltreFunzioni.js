// JScript File

//----------------------------------------------------------------------------------
// funzione che gestisce l'apertura delle pagine richieste e dei suoi filtri
//----------------------------------------------------------------------------------

//	ricaricoFltri:	1 se voglio ricaricare, 0 se non voglio 
//	hideFiltri:		1 se voglio nascondere il div dei filtri; 0 se lo voglio mostrare
//  paginazione:	contiene idati relativi alla pagina scelta ed al numero di pagina per colonne
    
function apriLink(url,ricaricoFiltri,hideFiltri,paginazione)
{   
    var rN = Math.floor(Math.random()*100000);
    var qs ='';
    var qrstr = url.split("?")
    
/**/	if (qrstr.length > 1) document.getElementsByName("hidFiltri").value = qrstr[1].replace("zz=","");
   	else document.getElementsByName("hidFiltri").value = "";
   	document.getElementsByName("hidPaginazione").value = paginazione;
	
	
/*	if (qrstr.length > 1) $('#hidFiltri').attr("value",qrstr[1].replace("zz=",""));
   	else $('#hidFiltri').attr("value","");
   	$('#hidPaginazione').attr("value",paginazione);
	*/
//     	$('#hidFiltri').attr("value",qrstr[1].replace("zz=",""));
//     	$('#paginazione').val(paginazione);
	//alert(document.getElementsByName("hidFiltri").value);
    window.document.body.style.cursor = 'wait';
    // per aggiungere nro random ed evitare la cache
    qs = qs + '&rN=' + rN.toString();
    $(".attesa").show();
    //alert(url + qs);
    //$('.mostraPagina').load(qrstr[0] +'?rN='+rN + qs);

    if (ricaricoFiltri == 1)
    {   $('.mostraFiltri').load('Filtri' + qrstr[0]) ;
          //alert('Filtri' + url.replace('aspx','html')+ qs);
    }
    else caricaPagina(qrstr[0]);
//    else $('.mostraPagina').load(qrstr[0] +'?rN='+rN + qs);
            
    
    if (hideFiltri == 1) $(".mostraFiltri").hide();
    else $(".mostraFiltri").show();
    
    //$(".show_hide").show();
    $(".show_hide").hide();    
}
    
function caricaPagina(url)
{
    var rN = Math.floor(Math.random()*100000);
	$('.mostraPagina').load(url +'?zz='+rN);
}    
    
function mostraImg(urlImg)
{
	var rN = Math.floor(Math.random()*100000);
	//alert(urlImg);
	//urlImg = urlImg.replace("http://","");
	//alert(urlImg);
	if (navigator.userAgent.indexOf('MSIE') > -1)
	{
		urlImg = sostChar(urlImg,"://","__");
		urlImg = sostChar(urlImg,"/-","___");
		urlImg = sostChar(urlImg,".","____");
		//alert(urlImg);
		urlImg = sostChar(urlImg,"/","_____");
		//alert(urlImg);
		urlImg = sostChar(urlImg,"-","______");
	}
	//alert(urlImg);
	try
	{
		window.open('MostraImg.html?rN=' +rN,urlImg);	//,"menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
	}
	catch(e)
	{
		//window.open('MostraImg.html?rN=' +rN,'http<picopalliimg');
		alert('Per favore non usare internet explorer!');
	}
}    	

function sostChar (stringa,chrIn,chrOut)
{
	while (stringa.indexOf(chrIn) > -1)
	{
		stringa = stringa.replace(chrIn,chrOut);
	}
	return stringa;
}
    
