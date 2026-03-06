import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import bancoCouro from "../assets/bancodecourocataloco.jpg"
import charrete from "../assets/charrete.jpg"
import volante from "../assets/volantedocataloco.jpg"
import teto from "../assets/teto.jpg"


export default function Catalogo() {
  return (
    <>
      <Navbar />

      <section className="catalogo">

        <div className="servico">
          <img src={bancoCouro} />
          <div className="descricao">
            <h3>Bancos em Couro Legítimo e Sintético</h3>
            <p>Oferecemos revestimento completo de bancos em couro legítimo ou sintético,
proporcionando mais sofisticação, conforto e valorização ao veículo.
Trabalhamos com materiais de alta qualidade e diversas opções de cores,
além de personalização de costuras e acabamentos para deixar o interior
do carro com aparência moderna e elegante.</p>
          </div>
        </div>

        <div className="servico">
          <img src={charrete} />
          <div className="descricao">
            <h3>Estofamento de Charretes</h3>
            <p>Realizamos estofamento completo para charretes, utilizando materiais
resistentes ao uso externo e às variações climáticas. Nosso trabalho
combina tradição artesanal com técnicas modernas para garantir conforto,
durabilidade e um acabamento de alta qualidade, ideal para uso frequente
e valorização estética da charrete..</p>
          </div>
        </div>

        <div className="servico">
          <img src={volante} />
          <div className="descricao">
            <h3>Revestimento de Volantes</h3>
            <p>Fazemos revestimento de volantes com costura manual e acabamento
profissional, respeitando o padrão original do veículo. O serviço
proporciona melhor aderência, conforto ao dirigir e renovação do
interior do carro, além de permitir personalizações em cores,
texturas e tipos de costura</p>
          </div>
        </div>

        <div className="servico">
          <img src={teto} />
          <div className="descricao">
            <h3>Revestimento de Teto</h3>
            <p>Somos especializados no revestimento e recuperação de tetos automotivos,
trabalhando com veículos modernos e clássicos, incluindo modelos como o
Fusca. Utilizamos materiais de qualidade e diversas opções de cores
para garantir um acabamento uniforme, elegante e durável no interior
do veículo.</p>
          </div>
        </div>

      </section>

      <Footer />

    </>
  )
}