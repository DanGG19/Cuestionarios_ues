// Motor de ejercicios determinístico, offline. No usa IA ni eval() de expresiones arbitrarias.
const SOLVER_TYPES = {
 lineal:{name:'EDO lineal · primer orden',description:'y′ + a y = b',fields:[['a','Coeficiente a',2],['b','Término b',6],['y0','y(0)',1]]},
 separable:{name:'Variables separables',description:'y′ = k xⁿ y',fields:[['k','Constante k',2],['n','Exponente n',1],['y0','y(0)',3]]},
 segundo:{name:'EDO homogénea · segundo orden',description:'A y″ + B y′ + C y = 0',fields:[['A','Coeficiente A',1],['B','Coeficiente B',-6],['C','Coeficiente C',5],['y0','y(0)',2],['v0','y′(0)',6]]},
 laplace:{name:'PVI con transformada de Laplace',description:'y′ + a y = b',fields:[['a','Coeficiente a',2],['b','Término b',0],['y0','y(0)',3]]},
 crecimiento:{name:'Crecimiento y desintegración',description:'y′ = k y',formula:"y'=ky",fields:[['k','Tasa k',-0.25],['y0','y(0)',100]]},
 forzado:{name:'Lineal con exponencial',description:'y′ + a y = c · e^(kx)',formula:"y'+ay=ce^{kx}",fields:[['a','Coeficiente a',2],['c','Amplitud c',3],['k','Exponente k',1],['y0','y(0)',2]]},
 euler:{name:'Cauchy–Euler · segundo orden',description:'A x² y″ + B x y′ + C y = 0',formula:"Ax^2y''+Bxy'+Cy=0",fields:[['A','Coeficiente A',1],['B','Coeficiente B',-3],['C','Coeficiente C',4],['y1','y(1)',2],['v1',"y′(1)",2]]}
};
const numFmt=(n)=>Math.abs(n)<1e-9?'0':Number(n.toFixed(5)).toString();
const numOK=(s)=>s!=='' && s!==null && Number.isFinite(Number(s)) && Math.abs(Number(s))<=1e5;
const pTex=(n)=>n<0?`(${numFmt(n)})`:numFmt(n);
const texSigned=(n)=>n<0?`-${numFmt(-n)}`:`+${numFmt(n)}`;
const mult=(n,s)=> n===0?'':n===1?`+${s}`:n===-1?`-${s}`:texSigned(n)+s;
const cleanPlus=s=>s.replace(/^\+/,'').replace(/\+\-/g,'-');
const exponentTerm=(k,v='x')=>k===0?'0':k===1?v:k===-1?'-'+v:numFmt(k)+v;
const exponential=(c,k,v='x')=>c===0?'0':(c===1?'':c===-1?'-':numFmt(c))+`e^{${exponentTerm(k,v)}}`;
const addExpressions=(a,b)=>a==='0'?b:b==='0'?a:(b.startsWith('-')?a+b:a+'+'+b);
const step=(title,math,why,detail='')=>({title,math,why,detail});
const out=(title,equation,steps,result,verify='',tip='')=>({title,equation,steps,result,verify,tip});
function customSolve(type,raw,withIC=true){
 const def=SOLVER_TYPES[type];if(!def)return {error:'Selecciona un método válido.'};
 const x={};for(const [key] of def.fields){if(!numOK(raw[key]))return {error:`Revisa el valor de ${key}.`};x[key]=Number(raw[key]);}

 if(type==='crecimiento'){
  const {k,y0}=x, eq=`y'=${numFmt(k)}y`;
  const steps=[
   step('Reconocer la proporción',eq,'La tasa y′ es proporcional a la cantidad y. El parámetro k determina crecimiento si es positivo y decaimiento si es negativo.','Esta forma también es separable: dy/y=k dx para y distinto de 0.'),
   step('Separar variables',`\\frac{dy}{y}=${numFmt(k)}\\,dx`,'Pasamos los términos con y al lado izquierdo; antes de dividir anotamos que y=0 es solución.','La separación convierte una ecuación diferencial en dos integrales sencillas.'),
   step('Integrar',`\\ln|y|=${numFmt(k)}x+C`,'La integral de 1/y es ln|y| y la integral de k respecto de x es kx.','La constante aparece una vez, porque las dos constantes se reúnen.'),
   step('Despejar',`y=Ce^{${exponentTerm(k)}}`,'Aplicamos la función exponencial y absorbemos el signo en C. También contiene y=0 al elegir C=0.')];
  if(withIC)steps.push(step('Usar el dato inicial',`y(0)=C=${numFmt(y0)}`,'En x=0, e⁰=1; por eso la constante coincide exactamente con y₀.'));
  const ans=`y(x)=${withIC?numFmt(y0):'C'}e^{${exponentTerm(k)}}`;
  return out(def.name,eq+(withIC?`,\\quad y(0)=${numFmt(y0)}`:''),steps,ans,withIC?`y'(0)=${numFmt(k*y0)}`:'', 'Si el dato inicial es cero, toda la solución es y=0.');
 }
 if(type==='forzado'){
  const {a,c,k,y0}=x;
  const eq=`y'${mult(a,'y')}=${numFmt(c)}e^{${exponentTerm(k)}}`, resonance=Math.abs(a+k)<1e-10;
  const steps=[
   step('Reconocer lineal no homogénea',eq,'La ecuación tiene la forma y′+a y=Q(x). La función Q es exponencial, por eso usamos un factor integrante.'),
   step('Construir el factor integrante',`\\mu=e^{\\int ${numFmt(a)}\\,dx}=e^{${exponentTerm(a)}}`,'Como μ′=aμ, entonces (μy)′=μ(y′+ay).','La forma del factor la determina a, no el forzamiento.'),
   step('Multiplicar toda la ecuación',`\\big(e^{${exponentTerm(a)}}y\\big)'=${numFmt(c)}e^{${exponentTerm(a+k)}}`,'Multiplica ambos lados por e^{ax}; los exponentes se suman: e^{ax}e^{kx}=e^{(a+k)x}.')];
  let ans;
  if(resonance){
   steps.push(step('Reconocer resonancia',`a+k=0\\quad\\Rightarrow\\quad (\\mu y)'=${numFmt(c)}`,'El producto exponencial se reduce a 1; integrar la constante genera el factor x que evita duplicar la homogénea.'));
   steps.push(step('Integrar y despejar',`y=(C+${numFmt(c)}x)e^{${exponentTerm(-a)}}`,'Integramos cx y dividimos por μ.'));
   if(withIC)steps.push(step('Aplicar y(0)',`C=${numFmt(y0)}`,'En x=0 la parte cx vale cero.'));
   ans=`y(x)=(${withIC?numFmt(y0):'C'}${mult(c,'x')})e^{${exponentTerm(-a)}}`;
  } else {
   const p=c/(a+k), h=y0-p;
   steps.push(step('Integrar la exponencial',`e^{${exponentTerm(a)}}y=\\frac{${numFmt(c)}}{${pTex(a+k)}}e^{${exponentTerm(a+k)}}+C`,'La primitiva de e^{mx} es e^{mx}/m, válida solo para m≠0.'));
   steps.push(step('Despejar la función',`y=${numFmt(p)}e^{${exponentTerm(k)}}+Ce^{${exponentTerm(-a)}}`,'Al dividir entre μ se resta ax a cada exponente.'));
   if(withIC)steps.push(step('Calcular C',`C=y_0-\\frac{c}{a+k}=${numFmt(h)}`,'Las dos exponenciales valen 1 en x=0.'));
   ans=`y(x)=${addExpressions(exponential(p,k),exponential(withIC?h:1,-a))}`;
   if(!withIC)ans=`y(x)=${numFmt(p)}e^{${exponentTerm(k)}}+Ce^{${exponentTerm(-a)}}`;
  }
  return out(def.name,eq+(withIC?`,\\quad y(0)=${numFmt(y0)}`:''),steps,ans,withIC?`y(0)=${numFmt(y0)}`:'', 'Si a+k=0, no dividas entre cero: integra la constante y aparece x.');
 }
 if(type==='euler'){
  const {A,B,C,y1,v1}=x;
  if(A===0)return {error:'A debe ser distinto de cero; de lo contrario, no es segundo orden.'};
  const b=B-A, d=b*b-4*A*C, alpha=-b/(2*A), beta=Math.sqrt(Math.max(0,-d))/(2*Math.abs(A));
  const eq=`${A===1?'':numFmt(A)}x^2y''${mult(B,"xy'")}${mult(C,'y')}=0`;
  const steps=[
   step('Identificar la forma Cauchy–Euler',eq,'Los coeficientes siguen el patrón x² para y″ y x para y′. No se usa la característica e^{rx} de coeficientes constantes.','Trabajaremos en x>0 para dar significado a ln x cuando aparezca.'),
   step('Proponer y=x^m',`y=x^m,\\quad y'=mx^{m-1},\\quad y''=m(m-1)x^{m-2}`,'Derivar potencias genera factores que cancelan x² y x tras la sustitución.'),
   step('Obtener la ecuación indicial',`${numFmt(A)}m(m-1)${mult(B,'m')}${texSigned(C)}=0`,'Sustituimos y=x^m y factorizamos x^m (no es cero en x>0).'),
   step('Reunir términos y hallar discriminante',`${numFmt(A)}m^2${mult(b,'m')}${texSigned(C)}=0,\\quad\\Delta=${numFmt(d)}`,'El término −Am proviene del producto m(m−1), de ahí que el coeficiente lineal sea B−A.')];
  let ans='';
  if(Math.abs(d)<1e-10){
   const r=alpha, c2=v1-r*y1;
   steps.push(step('Raíz indicial doble',`m=${numFmt(r)}\\quad\\Rightarrow\\quad y=x^{${numFmt(r)}}(C_1+C_2\\ln x)`,'La segunda solución linealmente independiente incluye ln x, no x.'));
   if(withIC)steps.push(step('Condiciones en x=1',`C_1=${numFmt(y1)},\\quad C_2=y'(1)-m\\,y(1)=${numFmt(c2)}`,'En x=1: ln1=0, 1^m=1 y la derivada de ln x vale 1.'));
   ans=`y(x)=x^{${numFmt(r)}}(${withIC?numFmt(y1):'C_1'}${mult(withIC?c2:1,withIC?'\\ln x':'C_2\\ln x')})`;
   if(!withIC)ans=`y(x)=x^{${numFmt(r)}}(C_1+C_2\\ln x)`;
  }else if(d>0){
   const r1=(-b+Math.sqrt(d))/(2*A),r2=(-b-Math.sqrt(d))/(2*A);
   const c1=(v1-r2*y1)/(r1-r2),c2=y1-c1;
   steps.push(step('Raíces indiciales reales',`m_1\\approx${numFmt(r1)},\\quad m_2\\approx${numFmt(r2)}`,'Dos raíces diferentes producen dos potencias distintas x^m.'));
   steps.push(step('Forma de la solución',`y=C_1x^{${numFmt(r1)}}+C_2x^{${numFmt(r2)}}`,'Para x>0, ambas potencias están bien definidas.'));
   if(withIC)steps.push(step('Condiciones en x=1',`C_1+C_2=${numFmt(y1)},\\quad ${numFmt(r1)}C_1${mult(r2,'C_2')}=${numFmt(v1)}`,'Al derivar x^m, el valor de la pendiente en x=1 se multiplica por m.'));
   if(withIC)steps.push(step('Resolver las dos constantes',`C_1\\approx${numFmt(c1)},\\quad C_2\\approx${numFmt(c2)}`,'Resuelve el sistema de posición y pendiente.'));
   ans=withIC?`y(x)\\approx${numFmt(c1)}x^{${numFmt(r1)}}${mult(c2,`x^{${numFmt(r2)}}`)}`:`y(x)=C_1x^{${numFmt(r1)}}+C_2x^{${numFmt(r2)}}`;
  }else{
   const c2=(v1-alpha*y1)/beta;
   steps.push(step('Raíces indiciales complejas',`m=${numFmt(alpha)}\\pm${numFmt(beta)}i`,'La parte real produce el factor x^α; la parte imaginaria introduce senos/cosenos de β ln x.'));
   steps.push(step('Forma real de solución',`y=x^{${numFmt(alpha)}}[C_1\\cos(${numFmt(beta)}\\ln x)+C_2\\sin(${numFmt(beta)}\\ln x)]`,'Se aplica la fórmula de Euler a x^{a+bi}=x^a e^{bi ln x}.'));
   if(withIC)steps.push(step('Usar y(1), y′(1)',`C_1=${numFmt(y1)},\\quad C_2=\\frac{y'(1)-\\alpha y(1)}\\beta\\approx${numFmt(c2)}`,'Como ln 1=0, cos0=1 y sen0=0.'));
   ans=`y(x)\\approx x^{${numFmt(alpha)}}(${withIC?numFmt(y1):'C_1'}\\cos(${numFmt(beta)}\\ln x)${mult(withIC?c2:1,`\\sin(${numFmt(beta)}\\ln x)`)})`;
   if(!withIC)ans=`y(x)=x^{${numFmt(alpha)}}[C_1\\cos(${numFmt(beta)}\\ln x)+C_2\\sin(${numFmt(beta)}\\ln x)]`;
  }
  return out(def.name,eq+(withIC?`,\\quad y(1)=${numFmt(y1)},\\;y'(1)=${numFmt(v1)}`:''),steps,ans,withIC?`y(1)=${numFmt(y1)},\\quad y'(1)=${numFmt(v1)}`:'', 'Dominio x>0. La indicial es Am²+(B−A)m+C=0.');
 }
 if(type==='lineal'||type==='laplace'){
  const {a,b,y0}=x, eq=`y'+${a<0?numFmt(a):numFmt(a)}y=${numFmt(b)}`.replace('+-','-');
  // In TeX, avoid y'+-2y; preserve the coefficient even when a=0.
  const showEq=`y'${mult(a,'y')}=${numFmt(b)}`;
  const steps=[];
  if(type==='laplace'){
   if(!withIC)return {error:'Para el método de Laplace hace falta indicar y(0). Activa la condición inicial.'};
   steps.push(step('Transformar derivadas',`\\mathcal L\{y'\}+${pTex(a)}\\mathcal L\{y\}=\\mathcal L\{${numFmt(b)}\}`,'Aplicamos la transformada a los dos miembros; la transformada es lineal.','Se trabaja con Y(s)=L{y(t)}.'));
   steps.push(step('Introducir y(0)',`(sY(s)-${pTex(y0)})${mult(a,'Y(s)')}=\\frac{${numFmt(b)}}s`,'La fórmula clave es L{y′}=sY(s)−y(0); y(0) debe restarse.','También usamos L{constante}=constante/s.'));
   steps.push(step('Despejar Y(s)',`(s${texSigned(a)})Y(s)=${numFmt(y0)}+\\frac{${numFmt(b)}}s`,'Reunimos los términos de Y(s) para convertir la EDO en álgebra.'));
   if(a!==0){
    const steady=b/a,initial=y0-steady;
    steps.push(step('Separar en fracciones invertibles',`Y(s)=\\frac{${numFmt(steady)}}s+\\frac{${pTex(initial)}}{s${texSigned(a)}}`,'Se reescribe la función racional como suma de formas presentes en la tabla de Laplace.','Esta igualdad procede de fracciones parciales: y₀s+b dividido por s(s+a).'));
    const ans=`y(t)=${addExpressions(numFmt(steady),exponential(initial,-a,'t'))}`;
    steps.push(step('Transformada inversa',ans,'L⁻¹{1/s}=1 y L⁻¹{1/(s+a)}=e^{−at}.','La solución respeta y(0) porque los dos coeficientes suman y₀.'));
    return out(def.name,showEq+`,\\quad y(0)=${numFmt(y0)}`,steps,ans,`y'(t)=${numFmt(-a*initial)}e^{${numFmt(-a)}t}\\;\Rightarrow\\;y'+ay=b`,'Comprueba el signo del dato inicial en sY−y(0).');
   }
   steps.push(step('Invertir para a=0',`Y(s)=\\frac{${numFmt(y0)}}s+\\frac{${numFmt(b)}}{s^2}`,'Cuando a=0, la ecuación se reduce a y′=b y las transformadas son directas.'));
   const ans=`y(t)=${addExpressions(numFmt(y0),b===0?'0':b===1?'t':b===-1?'-t':numFmt(b)+'t')}`;
   steps.push(step('Solución temporal',ans,'L⁻¹{1/s²}=t. Se verifica derivando: y′=b.'));
   return out(def.name,showEq+`,\\quad y(0)=${numFmt(y0)}`,steps,ans,`y'(t)=${numFmt(b)}`);
  }
  steps.push(step('Identificar la forma lineal',showEq,'Está en la forma y′+P(x)y=Q(x); aquí P(x)=a es constante y Q(x)=b.'));
  if(a===0){
   steps.push(step('Simplificar',`y'=${numFmt(b)}`,'Como el coeficiente de y es cero, basta integrar.'));
   steps.push(step('Integrar',`y=${numFmt(b)}x+C`,'La primitiva de la constante b es bx.'));
   if(withIC)steps.push(step('Condición inicial',`${numFmt(y0)}=C\\;\Rightarrow\\;y=${numFmt(b)}x+${pTex(y0)}`,'Al evaluar x=0 se anula bx y C=y(0).'));
   const ans=withIC?`y(x)=${addExpressions(b===0?'0':b===1?'x':b===-1?'-x':numFmt(b)+'x',numFmt(y0))}`:`y(x)=${addExpressions(b===0?'0':b===1?'x':b===-1?'-x':numFmt(b)+'x','C')}`;
   return out(def.name,showEq+(withIC?`,\\;y(0)=${numFmt(y0)}`:''),steps,ans,`y'(x)=${numFmt(b)}`);
  }
  steps.push(step('Calcular el factor integrante',`\\mu(x)=e^{\\int ${pTex(a)}\\,dx}=e^{${numFmt(a)}x}`,'Elegimos μ para que μ′=aμ y el lado izquierdo sea una derivada de producto.'));
  steps.push(step('Multiplicar toda la EDO',`(e^{${numFmt(a)}x}y)'=${numFmt(b)}e^{${numFmt(a)}x}`,'Producto: (μy)′=μy′+μ′y=μ(y′+ay).'));
  steps.push(step('Integrar y dividir',`e^{${numFmt(a)}x}y=\\frac{${numFmt(b)}}{${pTex(a)}}e^{${numFmt(a)}x}+C`,'Integramos e^{ax}: su primitiva es e^{ax}/a, para a≠0.'));
  const steady=b/a, initial=y0-steady;
  steps.push(step('Despejar y',`y=\\frac{${numFmt(b)}}{${pTex(a)}}+Ce^{${numFmt(-a)}x}`,'Dividimos todos los términos entre e^{ax}, que nunca es cero.'));
  if(withIC)steps.push(step('Aplicar y(0)',`C=${numFmt(y0)}-\\frac{${numFmt(b)}}{${pTex(a)}}=${numFmt(initial)}`,'En x=0 el factor exponencial vale 1, así que y₀=b/a+C.'));
  const ans=withIC?`y(x)=${addExpressions(numFmt(steady),exponential(initial,-a))}`:`y(x)=${numFmt(steady)}+Ce^{${exponentTerm(-a)}}`;
  return out(def.name,showEq+(withIC?`,\\;y(0)=${numFmt(y0)}`:''),steps,ans,withIC?`y'(0)=${numFmt(-a*initial)},\\quad a\\,y(0)+y'(0)=${numFmt(b)}`:'Al derivar y y sustituir en la EDO, se obtiene b.','En y′+ay=b, la solución particular constante b/a solo existe para a≠0.');
 }
 if(type==='separable'){
  const {k,n,y0}=x;
  if(!Number.isInteger(n)||n<0||n>8)return {error:'Para este constructor, n debe ser un entero entre 0 y 8.'};
  const pow=n===0?'':n===1?'x':`x^{${n}}`;
  const exponent=n===0?`x`:n+1===1?'x':`\\frac{x^{${n+1}}}{${n+1}}`;
  const expr=n===0?`${numFmt(k)}y`:`${numFmt(k)}${pow}y`;
  const showEq=`y'=${expr}`;
  const steps=[step('Reconocer producto separable',showEq,'El lado derecho es una función de x multiplicada por y, de modo que podemos agrupar las variables.'),step('Separar variables',`\\frac{dy}{y}=${numFmt(k)}${pow}\\,dx`,'Al dividir entre y se necesita y≠0. Se revisará y=0 por separado.'),step('Integrar',`\\ln|y|=${numFmt(k)}${n===0?'x':`\\frac{x^{${n+1}}}{${n+1}}`}+C`,'La integral de dy/y es ln|y|. La de xⁿ es xⁿ⁺¹/(n+1).'),step('Eliminar el logaritmo',`y=Ce^{${k===0?'0':`${numFmt(k)}${n===0?'x':`x^{${n+1}}/${n+1}`}`}}`,'Elevamos e a ambos lados y absorbemos el signo y e^C en una constante real. Esto también incluye y=0 cuando C=0.')];
  if(withIC)steps.push(step('Aplicar dato inicial',`y(0)=C=${numFmt(y0)}`,'En x=0, el exponente es cero; e⁰=1, por tanto C=y₀.'));
  const expt=n===0?`${numFmt(k)}x`:numFmt(k/(n+1))+`x^{${n+1}}`;
  const ans=withIC&&y0===0?'y(x)=0':`y(x)=${withIC?numFmt(y0):'C'}e^{${exponentTerm(k/(n+1),n===0?'x':`x^{${n+1}}`)}}`;
  return out(def.name,showEq+(withIC?`,\\;y(0)=${numFmt(y0)}`:''),steps,ans,`\\frac{y'}y=${numFmt(k)}${pow||'1'}`,'Al dividir entre y, no olvides comprobar la solución constante y=0.');
 }
 if(type==='segundo'){
  const {A,B,C,y0,v0}=x;
  if(A===0)return {error:'A no puede ser cero: dejaría de ser una EDO de segundo orden.'};
  const eq=`${A===1?'':numFmt(A)}y''${mult(B,"y'")}${mult(C,'y')}=0`;
  const D=B*B-4*A*C;
  const stages=[step('Identificar coeficientes',`A=${numFmt(A)},\\;B=${numFmt(B)},\\;C=${numFmt(C)}`,'En la ecuación característica A r²+B r+C=0, los coeficientes coinciden con los de y″, y′ e y.'),step('Formar característica',`${numFmt(A)}r^2${mult(B,'r')}${texSigned(C)}=0`,'Al probar y=e^{rx}, cada derivada aporta un factor r; se cancela e^{rx}, que no vale cero.'),step('Calcular discriminante',`\\Delta=B^2-4AC=${numFmt(D)}`,'El signo del discriminante decide si hay dos raíces reales, una doble o dos complejas conjugadas.')];
  if(Math.abs(D)<1e-10){
   const r=-B/(2*A), c2=v0-r*y0;
   stages.push(step('Raíz doble',`r=-\\frac B{2A}=${numFmt(r)}`,'Si Δ=0 se repite una raíz, por tanto las dos soluciones básicas son e^{rx} y xe^{rx}.'));
   stages.push(step('Solución general',`y=(C_1+C_2x)e^{${numFmt(r)}x}`,'El factor x garantiza que la segunda función sea independiente de la primera.'));
   if(withIC)stages.push(step('Calcular C₁ y C₂',`C_1=${numFmt(y0)},\\quad C_2=y'(0)-r\\,y(0)=${numFmt(c2)}`,'En x=0, y=C₁ y y′=C₂+rC₁. Se despeja cada constante.'));
   const ans=withIC?`y(x)=(${numFmt(y0)}${mult(c2,'x')})e^{${numFmt(r)}x}`:`y(x)=(C_1+C_2x)e^{${numFmt(r)}x}`;
   return out(def.name,eq+(withIC?`,\\quad y(0)=${numFmt(y0)},\\;y'(0)=${numFmt(v0)}`:''),stages,ans,withIC?`y(0)=${numFmt(y0)},\\quad y'(0)=${numFmt(v0)}`:'', 'Raíz repetida: multiplica la segunda solución por x.');
  }
  if(D>0){
   const r1=(-B+Math.sqrt(D))/(2*A),r2=(-B-Math.sqrt(D))/(2*A),c1=(v0-r2*y0)/(r1-r2),c2=y0-c1;
   stages.push(step('Fórmula cuadrática',`r_{1,2}=\\frac{-B\\pm\\sqrt\\Delta}{2A}\\;\Rightarrow\\; r_1\\approx ${numFmt(r1)},\\;r_2\\approx ${numFmt(r2)}`,'Δ>0 produce dos raíces reales distintas. Cuando el trinomio factoriza, estas mismas raíces se obtienen por producto cero.'));
   stages.push(step('Solución general',`y=C_1e^{${numFmt(r1)}x}+C_2e^{${numFmt(r2)}x}`,'Cada raíz origina una exponencial; combinarlas aporta las dos constantes necesarias para orden 2.'));
   if(withIC)stages.push(step('Resolver condiciones iniciales',`C_1+C_2=${numFmt(y0)},\\quad ${numFmt(r1)}C_1${mult(r2,'C_2')}=${numFmt(v0)}`,'En x=0 se usa e⁰=1; al derivar e^{rx}, el coeficiente se multiplica por r. Resolver el sistema da C₁ y C₂.'));
   if(withIC)stages.push(step('Constantes calculadas',`C_1\\approx${numFmt(c1)},\\quad C_2\\approx${numFmt(c2)}`,'La primera ecuación controla la posición y la segunda controla la pendiente inicial.'));
   const ans=withIC?`y(x)\\approx ${addExpressions(exponential(c1,r1),exponential(c2,r2))}`:`y(x)=C_1e^{${exponentTerm(r1)}}+C_2e^{${exponentTerm(r2)}}`;
   return out(def.name,eq+(withIC?`,\\quad y(0)=${numFmt(y0)},\\;y'(0)=${numFmt(v0)}`:''),stages,ans,withIC?`C_1+C_2=${numFmt(y0)},\\quad r_1C_1+r_2C_2=${numFmt(v0)}`:'','Si las raíces son enteras, revisa factorización antes de usar fórmula cuadrática.');
  }
  const alpha=-B/(2*A),beta=Math.sqrt(-D)/(2*Math.abs(A)), coef=(v0-alpha*y0)/beta;
  stages.push(step('Raíces complejas',`r=\\frac{-B}{2A}\\pm i\\frac{\\sqrt{-\\Delta}}{2|A|}\\approx ${numFmt(alpha)}\\pm${numFmt(beta)}i`,'Δ<0. La parte real α controla el crecimiento o decaimiento; |β| es la frecuencia angular.'));
  stages.push(step('Forma trigonométrica real',`y=e^{${numFmt(alpha)}x}(C_1\\cos(${numFmt(beta)}x)+C_2\\sin(${numFmt(beta)}x))`,'Por la fórmula de Euler, dos exponenciales complejas conjugadas forman un par real seno/coseno.'));
  if(withIC)stages.push(step('Usar y(0) y y′(0)',`C_1=${numFmt(y0)},\\quad C_2=\\frac{${numFmt(v0)}-${pTex(alpha)}\\cdot${pTex(y0)}}{${numFmt(beta)}}\\approx ${numFmt(coef)}`,'Como cos0=1 y sen0=0, C₁=y₀. La derivada en 0 es αC₁+βC₂.'));
  const ans=withIC?`y(x)\\approx e^{${numFmt(alpha)}x}(${numFmt(y0)}\\cos(${numFmt(beta)}x)${mult(coef,`\\sin(${numFmt(beta)}x)` )})`:`y(x)=e^{${numFmt(alpha)}x}(C_1\\cos(${numFmt(beta)}x)+C_2\\sin(${numFmt(beta)}x))`;
  return out(def.name,eq+(withIC?`,\\quad y(0)=${numFmt(y0)},\\;y'(0)=${numFmt(v0)}`:''),stages,ans,withIC?`y(0)=${numFmt(y0)},\\quad y'(0)\\approx ${numFmt(v0)}`:'','Raíces α±βi ⇒ e^{αx}(C₁ cos βx+C₂ sen βx).');
 }
 return {error:'Este caso todavía no está implementado.'};
}
function parseEquation(input){
 const s=String(input).toLowerCase().replace(/[−–]/g,'-').replace(/[′’]/g,"'").replace(/\s+/g,'').replace(/\*/g,'');
 if(s.length>160)return {error:'La ecuación es demasiado larga.'};
 const parts=s.split(/[,;]/).filter(Boolean);if(!parts.length)return {error:'Escribe una ecuación.'};
 const expression=parts[0];
 const initials={};for(const v of parts.slice(1)){
  const m=v.match(/^(y|y')\(0\)=([+-]?(?:\d+(?:\.\d+)?|\.\d+))$/);
  if(!m)return {error:'Condición inicial no reconocida. Usa y(0)=3 o y\'(0)=1.'};
  initials[m[1]==="y'"?'v0':'y0']=Number(m[2]);
 }
 const pieces=expression.split('=');if(pieces.length!==2)return {error:'La expresión debe tener exactamente un signo =.'};
 const [lhs,rhs]=pieces;
 const getCoef=(raw)=>{let m=raw.match(/^([+-]?)(\d*(?:\.\d+)?)$/);if(!m)return null;let val=m[2]?Number(m[2]):1;return m[1]==='-'?-val:val};
 const rhsValue=Number(rhs);const rhsNumeric=rhs!==''&&Number.isFinite(rhsValue);
 if(/^y'$/.test(lhs)){
  const match=rhs.match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+)?)x(?:\^(\d+))?y$/);
  const simple=rhs.match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+)?)y$/);
  if(match||simple){const k=getCoef((match||simple)[1]);const n=match?Number(match[2]||1):0;
   return {type:'separable',values:{k,n,...initials},withIC:'y0' in initials};}
 }
 const tokens=lhs.match(/[+-]?[^+-]+/g)||[];
 const vals={"y''":0,"y'":0,'y':0};let ok=tokens.length>0;
 for(const token of tokens){const m=token.match(/^([+-]?)(\d*(?:\.\d+)?)?(y''|y'|y)$/);if(!m){ok=false;break;}const coefficient=getCoef((m[1]||'')+(m[2]||''));if(coefficient===null){ok=false;break;}vals[m[3]]+=coefficient;}
 if(!ok||!rhsNumeric)return {error:'Formato no admitido. Usa, por ejemplo: y\'+2y=6 o y\'\'-3y\'+2y=0.'};
 if(vals["y''"]!==0){if(rhsValue!==0)return {error:'El segundo orden admite por ahora únicamente el caso homogéneo (=0).'};return {type:'segundo',values:{A:vals["y''"],B:vals["y'"],C:vals.y,...initials},withIC:'y0' in initials && 'v0' in initials};}
 if(vals["y'"]===0)return {error:'No se encontró una derivada y′ o y″.'};
 return {type:'lineal',values:{a:vals.y/vals["y'"],b:rhsValue/vals["y'"],...initials},withIC:'y0' in initials};
}
function factorSolve(a,b,c){
 if(![a,b,c].every(v=>numOK(v)))return {error:'Escribe tres coeficientes numéricos.'};a=+a;b=+b;c=+c;
 if(a===0)return {error:'a debe ser distinto de cero para un polinomio cuadrático.'};
 let d=b*b-4*a*c;
 const steps=[step('Reconocer el trinomio',`${numFmt(a)}x^2${mult(b,'x')}${texSigned(c)}`,'El grado 2 indica una expresión cuadrática; primero intentamos factorizar y luego usar la fórmula general.'),step('Discriminante',`\\Delta=${numFmt(b)}^2-4(${numFmt(a)})(${numFmt(c)})=${numFmt(d)}`,'Δ>0: dos raíces reales; Δ=0: raíz doble; Δ<0: raíces complejas.')];
 let result='';
 if(d>=0){let r1=(-b+Math.sqrt(d))/(2*a),r2=(-b-Math.sqrt(d))/(2*a);
  steps.push(step('Fórmula general',`x_{1,2}=\\frac{-(${numFmt(b)})\\pm\\sqrt{${numFmt(d)}}}{2(${numFmt(a)})}`,'Se obtiene al completar el cuadrado; sirve aunque la expresión no factorice con números enteros.'));
  steps.push(step('Raíces',`x_1\\approx ${numFmt(r1)},\\quad x_2\\approx ${numFmt(r2)}`,'Cada raíz hace que el polinomio valga cero. Si son enteras, verifica suma −b/a y producto c/a.'));
  result=`${a===1?'':a===-1?'-':numFmt(a)}(x${texSigned(-r1)})(x${texSigned(-r2)})`;
 }else{
  let re=-b/(2*a),im=Math.sqrt(-d)/(2*Math.abs(a));
  steps.push(step('Raíces complejas',`x_{1,2}\\approx ${numFmt(re)}\\pm${numFmt(im)}i`,'No hay factorización lineal real; las raíces son conjugadas complejas.'));
  result=`x_{1,2}\\approx ${numFmt(re)}\\pm ${numFmt(im)}i`;
 }
 return out('Factorización cuadrática',`${numFmt(a)}x^2${mult(b,'x')}${texSigned(c)}`,steps,result,'','Comprueba al expandir los factores: deben reaparecer a, b y c.');
}
function triangleSolve(a,b){
 if(!numOK(a)||!numOK(b)||+a<=0||+b<=0)return {error:'Los dos catetos deben ser positivos.'};a=+a;b=+b;
 const h=Math.hypot(a,b), angle=Math.atan2(a,b)*180/Math.PI;
 return out('Triángulo rectángulo',`\\text{opuesto}=${numFmt(a)},\\quad\\text{adyacente}=${numFmt(b)}`,[
 step('Pitágoras',`h^2=${numFmt(a)}^2+${numFmt(b)}^2`,'En un triángulo rectángulo, el cuadrado de la hipotenusa es la suma de los cuadrados de los catetos.'),
 step('Hallar la hipotenusa',`h=\\sqrt{${numFmt(a*a+b*b)}}\\approx ${numFmt(h)}`,'La hipotenusa es positiva y opuesta al ángulo recto.'),
 step('Razones trigonométricas',`\\sin\\theta=\\frac{${numFmt(a)}}{${numFmt(h)}},\\quad\\cos\\theta=\\frac{${numFmt(b)}}{${numFmt(h)}}`,'El seno compara opuesto/hipotenusa y el coseno adyacente/hipotenusa.'),
 step('Tangente y ángulo',`\\tan\\theta=\\frac{${numFmt(a)}}{${numFmt(b)}},\\quad \\theta\\approx ${numFmt(angle)}^\\circ`,'La tangente compara opuesto/adyacente; el ángulo se obtiene con atan2.')],`h\\approx${numFmt(h)},\\quad\\theta\\approx${numFmt(angle)}^\\circ`,`A=\\frac{ab}2=${numFmt(a*b/2)}`,'En funciones sen/cos de EDO, trabaja en radianes; grados solo para el triángulo.');
}
const SPECIAL_TRIG={0:['0','1'],30:['\\frac12','\\frac{\\sqrt3}2'],45:['\\frac{\\sqrt2}2','\\frac{\\sqrt2}2'],60:['\\frac{\\sqrt3}2','\\frac12'],90:['1','0'],120:['\\frac{\\sqrt3}2','-\\frac12'],135:['\\frac{\\sqrt2}2','-\\frac{\\sqrt2}2'],150:['\\frac12','-\\frac{\\sqrt3}2'],180:['0','-1'],210:['-\\frac12','-\\frac{\\sqrt3}2'],225:['-\\frac{\\sqrt2}2','-\\frac{\\sqrt2}2'],240:['-\\frac{\\sqrt3}2','-\\frac12'],270:['-1','0'],300:['-\\frac{\\sqrt3}2','\\frac12'],315:['-\\frac{\\sqrt2}2','\\frac{\\sqrt2}2'],330:['-\\frac12','\\frac{\\sqrt3}2']};
function trigSolve(raw){if(!numOK(raw))return {error:'Escribe un ángulo numérico en grados.'};let deg=+raw;if(Math.abs(deg)>1e5)return {error:'Ángulo fuera de rango.'};const norm=((deg%360)+360)%360;const rad=deg*Math.PI/180;let s=Math.sin(rad),c=Math.cos(rad);if(Math.abs(s)<1e-10)s=0;if(Math.abs(c)<1e-10)c=0;const sintex=SPECIAL_TRIG[norm]?.[0]||numFmt(s),costex=SPECIAL_TRIG[norm]?.[1]||numFmt(c);
 let steps=[step('Grados a radianes',`\\theta=${numFmt(deg)}^\\circ\\cdot\\frac\\pi{180^\\circ}\\approx${numFmt(rad)}\\,\\text{rad}`,'En derivadas, integrales y EDO, la variable trigonométrica se mide en radianes.'),step('Círculo unitario',`(\\cos\\theta,\\sin\\theta)=(${costex},${sintex})`,'El punto del círculo unitario tiene coordenada horizontal cosθ y vertical senθ.'),step('Identidad pitagórica',`\\sin^2\\theta+\\cos^2\\theta=1`,'Se desprende de x²+y²=1, la ecuación del círculo de radio 1.')];
 if(c!==0)steps.push(step('Tangente',`\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}\\approx ${numFmt(s/c)}`,'Divide seno por coseno, siempre que cosθ sea distinto de cero.'));
 else steps.push(step('Tangente no definida',`\\cos\\theta=0`,'La tangente requiere dividir entre cosθ; la división por cero no existe.'));
 return out('Círculo trigonométrico',`\\theta=${numFmt(deg)}^\\circ`,steps,`\\sin\\theta=${sintex},\\quad\\cos\\theta=${costex}`,'','Truco: 30°→π/6, 45°→π/4, 60°→π/3, 90°→π/2.');
}
