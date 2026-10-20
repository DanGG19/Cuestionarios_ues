// Complemento editorial: explicación específica y motivo de cada paso de las 19 lecciones.
const DEEP_GUIDE = {
 s1: {
  idea:'El orden se lee en las derivadas, no en las potencias de x. Una EDO lineal no multiplica y por sus derivadas ni eleva y a potencias distintas de 1.',
  when:'Cuando el ejercicio pide clasificar una ecuación antes de intentar resolverla.',
  tip:'Una ecuación puede ser lineal de segundo orden y homogénea aunque tenga coeficientes que dependan de x.',
  reasons:[
   ['Se localiza la derivada de orden más alto.','La segunda derivada determina el orden; aquí no aparece una tercera derivada.'],
   ['Se revisa la forma de las incógnitas.','y, y′ e y″ aparecen solo en primer grado, sin productos entre ellas; los coeficientes pueden ser números o funciones de x.'],
   ['Se identifica el término independiente.','Al igualar toda la expresión a cero no queda una fuerza o función externa: es homogénea en el sentido lineal.']]
 },
 s2:{
  idea:'Separar significa convertir y′=dy/dx en una igualdad entre una expresión en y y otra en x.',
  when:'Cuando y′ puede escribirse como f(x)g(y).',
  tip:'Antes de dividir por g(y), comprueba g(y)=0: puede producir soluciones constantes.',
  reasons:[
   ['Separación de variables','Se divide entre y (si y≠0) y se multiplica por dx para colocar dy/y a la izquierda y 2x dx a la derecha. También se comprueba y=0 aparte.'],
   ['Integración de ambos lados','La primitiva de 1/y es ln|y| y la de 2x es x². Las constantes se reúnen en una sola C.'],
   ['Despeje exponencial','Se eleva e a ambos lados: |y|=e^C e^{x²}. El signo y el factor e^C se absorben en una nueva constante real.'],
   ['Uso del dato inicial','Al sustituir x=0, y=3 se obtiene 3=C·1. Esta condición elige una única solución de la familia.']]
 },
 s3:{idea:'La sustitución u=y/x funciona porque la pendiente depende de una proporción, no de x e y de manera independiente.',when:'Cuando aparece y/x o M y N son homogéneas del mismo grado.',tip:'En este ejemplo también existe y=0; se pierde al dividir por u².',reasons:[
  ['Cambio de variable','y=ux permite sustituir y/x por u. Se usa la regla del producto: y′=u+xu′.'],
  ['Cancelación de términos','Los términos u aparecen en ambos miembros, por eso se cancelan y queda xu′=u².'],
  ['Separación en u y x','Escribimos u′=du/dx, dividimos por u² y por x para separar. Requiere x≠0 y u≠0.'],
  ['Integración','∫u⁻²du=−u⁻¹ y ∫dx/x=ln|x|. No se omite el valor absoluto.'],
  ['Regreso a la variable original','Como u=y/x, reemplazamos y despejamos y. La solución vale donde el denominador no se anula.']]
 },
 s3e:{idea:'La exactitud busca una sola función potencial Ψ(x,y), cuya diferencial reproduzca los dos términos originales.',when:'Cuando la EDO está escrita M dx+N dy=0.',tip:'Al integrar respecto a x, la “constante” puede depender de y: escribe h(y).',reasons:[
  ['Prueba de exactitud','La igualdad entre las derivadas cruzadas es el criterio para buscar una función potencial en una región adecuada.'],
  ['Reconstrucción de Ψ','Se integra M respecto a x manteniendo y fija. Falta una función h(y), invisible al derivar respecto a x.'],
  ['Determinación de h′','Se deriva la potencial respecto a y y se compara con N para recuperar la parte que faltaba.'],
  ['Integración final','h′(y)=2y implica h(y)=y² (más constante). Por eso Ψ=x²y+x+y²=C.']]
 },
 s4:{idea:'El factor integrante transforma dos términos separados en una sola derivada de producto.',when:'Cuando se puede escribir y′+P(x)y=Q(x).',tip:'Comprueba: (μy)′=μy′+μ′y y, por definición, μ′=Pμ.',reasons:[
  ['Cálculo del factor integrante','P(x)=2 y ∫2dx=2x. Se toma μ=e^{2x}; una constante multiplicativa no aporta nada.'],
  ['Reconocimiento de la derivada de producto','Al multiplicar TODA la ecuación por e^{2x}, el lado izquierdo se convierte en (e^{2x}y)′ y el derecho en e^{3x}.'],
  ['Integración','Se integra una derivada completa: e^{2x}y=∫e^{3x}dx=e^{3x}/3+C.'],
  ['Despeje de la incógnita','Se divide cada término por e^{2x}: e^{3x}/e^{2x}=e^x y C/e^{2x}=Ce^{-2x}.']]
 },
 s4b:{idea:'La potencia yⁿ impide tratar Bernoulli como lineal; v=y^{1−n} elimina esa no linealidad.',when:'Cuando y′+Py=Qyⁿ con n distinto de 0 y 1.',tip:'Dividir entre y² excluye provisionalmente y=0; comprueba si también resuelve la original.',reasons:[
  ['Preparación del cambio','Se divide toda la ecuación por y² para obtener exactamente los términos y⁻²y′ y y⁻¹ que generarán v′ y v.'],
  ['Derivación de la sustitución','Para n=2 se define v=y⁻¹. Por regla de la cadena, v′=−y⁻²y′.'],
  ['Conversión a EDO lineal','El signo menos al sustituir la derivada obliga a cambiar signos; queda v′−v=−x.'],
  ['Resolución de v','El factor integrante es e⁻ˣ. Como (ve⁻ˣ)′=−xe⁻ˣ, al integrar y despejar queda v=x+1+Ceˣ.'],
  ['Regreso a y','v=1/y implica y=1/v. El denominador debe ser distinto de cero en el intervalo elegido.']]
 },
 s6:{idea:'La tasa proporcional conduce a una exponencial. El parámetro k se obtiene de dos mediciones.',when:'Cuando el enunciado dice que la rapidez de cambio es proporcional a la cantidad existente.',tip:'Si k está en 1/día, el tiempo t debe medirse en días.',reasons:[
  ['Solución del modelo','Integrar dP/P=k dt produce P=Ce^{kt}; al evaluar P(0), e⁰=1 y C=500.'],
  ['Sustitución de la segunda medición','P(3)=8000 crea 8000/500=16=e^{3k}. Se aíslan primero las cantidades numéricas.'],
  ['Uso del logaritmo','ln y exponencial son operaciones inversas: ln(e^{3k})=3k y k=ln16/3.'],
  ['Modelo final','Se sustituye k en la fórmula de P. La identidad e^{(ln16)t/3}=16^{t/3} permite escribir otra forma equivalente.']]
 },
 s6m:{idea:'Un balance conserva la sustancia: acumulación = entrada − salida. El volumen puede variar con t.',when:'Cuando un tanque mezcla uniformemente líquidos con caudales de entrada y salida.',tip:'No confundas cantidad A(t) con concentración A(t)/V(t).',reasons:[
  ['Balance de volumen','Entran 5 y salen 3 unidades de volumen por tiempo, así que V′=2 y V(t)=100+2t.'],
  ['Balance de sustancia','Entran 2·5=10 unidades de soluto/tiempo; salen (A/V)·3. Por eso A′=10−3A/V.'],
  ['Factor integrante','La forma estándar es A′+[3/(100+2t)]A=10. Al integrar el coeficiente aparece (3/2)ln(100+2t).'],
  ['Integración y simplificación','Se integra (μA)′=10μ. Como ∫10(100+2t)^{3/2}dt=2(100+2t)^{5/2}, al dividir por μ queda 2(100+2t)+Cμ⁻¹.'],
  ['Condición inicial','De A(0)=50 sale 50=200+C/1000; por tanto C=−150000. Revisa unidades y dominio V(t)>0.']]
 },
 s7:{idea:'El wronskiano detecta si las dos soluciones aportan direcciones independientes.',when:'Cuando necesitas verificar un conjunto fundamental para una EDO lineal homogénea.',tip:'Para soluciones de la misma EDO lineal de segundo orden con coeficientes continuos, W≠0 en un punto basta.',reasons:[
  ['Derivación','La derivada de e^{kx} es ke^{kx}; de ahí se obtienen las dos entradas inferiores del determinante.'],
  ['Determinante 2×2','Se calcula diagonal principal menos diagonal secundaria: y₁y₂′−y₂y₁′.'],
  ['Conclusión','2e^{3x}−e^{3x}=e^{3x}. Nunca vale cero, de modo que las funciones son independientes.']]
 },
 s7r:{idea:'Una solución conocida y₁ permite buscar otra de la forma y₂=v·y₁, sin resolver desde cero.',when:'Cuando conoces una solución de una ecuación homogénea de segundo orden.',tip:'Las constantes que solo replican y₁ se descartan al elegir la segunda solución.',reasons:[
  ['Regla del producto','Al derivar vx dos veces aparecen v, v′ y v″; el término v″ reduce la ecuación a una para v′.'],
  ['Sustitución completa','Se introducen y=vx y sus derivadas en los tres términos x²y″, −xy′ e y sin omitir ninguno.'],
  ['Simplificación','Los términos con v se cancelan porque y₁=x ya era una solución; lo restante se divide por x², para x≠0.'],
  ['Derivada condensada','xv″+v′=(xv′)′. Integrar una vez da xv′=C y luego v′=C/x.'],
  ['Segunda solución','Integrar 1/x da ln|x|. Elegimos v=ln|x|; así xln|x| no es múltiplo constante de x.']]
 },
 s8:{idea:'La sustitución y=e^{mx} transforma una ecuación diferencial de coeficientes constantes en un polinomio.',when:'Cuando aparecen y″, y′, y con coeficientes constantes.',tip:'Para factorizar m²+bm+c busca dos números cuya suma sea b y cuyo producto sea c.',reasons:[
  ['Ecuación característica','Si y=e^{mx}, entonces y′=me^{mx} y y″=m²e^{mx}. Se divide por e^{mx}, que nunca es cero.'],
  ['Factorización del trinomio','Buscamos dos números cuya suma sea −6 y producto 5: −1 y −5. Por ello (m−1)(m−5)=0.'],
  ['Propiedad del producto cero','Un producto vale cero si al menos un factor es cero; resolvemos m−1=0 y m−5=0.'],
  ['Superposición','Cada raíz real diferente genera una exponencial. Su combinación lineal es la solución general homogénea.']]
 },
 s8a:{idea:'En ecuaciones forzadas: solución general = complementaria + particular.',when:'Cuando y″+ay′+by=g(x) y g es una exponencial, polinomio o función trigonométrica sencilla.',tip:'Si la forma tentativa de yₚ ya aparece en y_c, multiplícala por x (o por x² si hay raíz doble).',reasons:[
  ['Parte homogénea','Primero se ignora temporalmente e^{3x} y se resuelve la característica con raíces 1 y 2.'],
  ['Propuesta particular','Como el lado derecho es e^{3x} y 3 no es raíz característica, probamos Ae^{3x} sin factor x.'],
  ['Derivación de la propuesta','Cada derivada de e^{3x} añade factor 3; el coeficiente A permanece constante.'],
  ['Comparación de coeficientes','La sustitución produce (9−9+2)Ae^{3x}=e^{3x}. Cancelamos la exponencial y obtenemos A=1/2.']]
 },
 s9:{idea:'Variación de parámetros reemplaza constantes por funciones para obtener soluciones particulares con forzamientos no habituales.',when:'Cuando conoces y₁,y₂ de la homogénea y el término f(x) no encaja fácilmente en coeficientes indeterminados.',tip:'Antes de usar las fórmulas, divide por el coeficiente de y″: la ecuación debe estar normalizada.',reasons:[
  ['Base homogénea y Wronskiano','y″+y=0 tiene soluciones cos x y sen x; W=cos²x+sen²x=1 por identidad pitagórica.'],
  ['Fórmula de u₁′','Se usa u₁′=−y₂f/W. Aquí −sen x·(1/cos x)=−tan x.'],
  ['Integración de u₁','∫−tan x dx=ln|cos x|; al derivar el logaritmo se recupera −tan x.'],
  ['Fórmula de u₂′','u₂′=y₁f/W=cos x·sec x=1; su integral es x (sin constantes redundantes).'],
  ['Reconstrucción de yₚ','Se combina u₁y₁+u₂y₂. La expresión solo tiene sentido donde cos x≠0.']]
 },
 s9c:{idea:'En Cauchy–Euler las potencias de x de los coeficientes compensan las pérdidas de exponentes al derivar x^m.',when:'Cuando la EDO tiene el patrón x²y″+axy′+by=0.',tip:'Si el polinomio indicial tiene raíz doble m, la segunda solución es x^m ln|x|.',reasons:[
  ['Ansatz de potencias','Se deriva x^m mediante la regla de la potencia. El producto x²y″ vuelve a ser múltiplo de x^m.'],
  ['Ecuación indicial','Se divide la EDO entre x^m en un intervalo que excluya x=0 y se obtiene m(m−1)−3m+4=0.'],
  ['Completar cuadrado o factorizar','Al distribuir m(m−1) se obtiene m²−4m+4=(m−2)²: una raíz m=2 de multiplicidad 2.'],
  ['Solución de raíz repetida','Una sola potencia x² no basta; el factor ln|x| aporta una segunda solución independiente. Se muestra x>0.']]
 },
 s10:{idea:'El resorte sin rozamiento obedece a una oscilación armónica, y las raíces imaginarias generan senos y cosenos.',when:'Cuando actúa una fuerza restauradora proporcional al desplazamiento.',tip:'La frecuencia angular ω está en rad/unidad de tiempo. No confundas ω con el período 2π/ω.',reasons:[
  ['Raíces imaginarias','r²+9=0 ⇒ r²=−9 ⇒ r=±3i. El módulo imaginario fija ω=3.'],
  ['Solución trigonométrica','Las raíces ±3i se traducen en la base real cos(3t), sen(3t).'],
  ['Posición inicial','En t=0, cos0=1 y sen0=0; por eso x(0)=A=2.'],
  ['Velocidad inicial','Derivamos: x′=−3A sen3t+3B cos3t. Al poner t=0 resulta 3B=0.'],
  ['Período','Una oscilación de cos(ωt) ocupa 2π radianes, así que ωT=2π y T=2π/3.']]
 },
 s12:{idea:'La linealidad permite transformar por separado cada sumando.',when:'Cuando la función es una suma de términos cuya transformada conoces.',tip:'Para tⁿ: factorial n! arriba y potencia s^{n+1} abajo. No uses s^n.',reasons:[
  ['Linealidad','La transformada de una suma es la suma de las transformadas, y los factores constantes salen de L.'],
  ['Potencia de t','La tabla indica L{tⁿ}=n!/s^{n+1}; con n=2 se obtiene 2/s³.'],
  ['Constante 1','La transformada de 1 es 1/s para s>0, por lo que la de 2 será 2/s.'],
  ['Reunión del resultado','Multiplicamos el primer término por 3 y el segundo por 2; no mezclamos denominadores innecesariamente.']]
 },
 s13:{idea:'Laplace aprovecha los valores iniciales y convierte derivadas en potencias de s por Y(s).',when:'Cuando hay condiciones iniciales y quieres resolver mediante transformadas.',tip:'L{y′}=sY−y(0): el término inicial siempre se resta.',reasons:[
  ['Aplicación de L a ambos lados','La transformada respeta las sumas: L{y′}+2L{y}=L{0}=0.'],
  ['Incorporación del dato inicial','Se usa L{y′}=sY−y(0), con y(0)=3; L{y}=Y. Por eso aparece −3.'],
  ['Álgebra en s','Los términos sY y 2Y comparten factor Y: (s+2)Y=3, luego Y=3/(s+2).'],
  ['Transformada inversa','La pareja L{e^{at}}=1/(s−a) con a=−2 lleva 1/(s+2) a e^{-2t}.']]
 },
 s14:{idea:'La traslación retrasa en el tiempo una función y aparece como factor e^{-as} en Laplace.',when:'Cuando un proceso se enciende a partir de un instante t=a.',tip:'La regla exige f(t−a) dentro del escalón; si hay f(t) debes reescribirla primero.',reasons:[
  ['Identificación del retardo','Se compara u(t−2)(t−2) con u(t−a)f(t−a); aquí a=2 y f(t)=t.'],
  ['Transformada base','La tabla da L{t}=1/s² para s>0.'],
  ['Regla de traslación','El cambio temporal multiplica F(s) por e^{−2s}, sin cambiar el factor 1/s².']]
 },
 s15:{idea:'El producto de transformadas equivale a la convolución temporal.',when:'Cuando aparecen integrales de convolución o el producto F(s)G(s).',tip:'En fracciones parciales, primero comprueba por sustitución que la descomposición reproduce el cociente.',reasons:[
  ['Primer factor','L{e^t}=1/(s−1), válido para s>1.'],
  ['Segundo factor','L{sen t}=1/(s²+1). Se usa la tabla trigonométrica.'],
  ['Teorema de convolución','L{f*g}=F(s)G(s), por eso se multiplican las dos expresiones racionales.'],
  ['Fracciones parciales','Descomponemos en A/(s−1)+(Bs+C)/(s²+1). Al igualar coeficientes sale A=1/2, B=−1/2, C=−1/2.']]
 }
};
