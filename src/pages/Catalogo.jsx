import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import bancoCouro from "../assets/bancodecourocataloco.jpg"
import charrete from "../assets/charrete.jpg"
import volante from "../assets/volantedocataloco.jpg"
import teto from "../assets/teto.jpg"
import bancoMoto from "../assets/bancodemoto.jpg"

export default function Catalogo() {
  return (
    <>
      <Navbar />

      <section className="catalogo">

        <div className="servico">
          <div className="img-container">
            <img src={bancoCouro} alt="Bancos em Couro" />
          </div>
          <div className="descricao">
            <h3>Bancos em Couro Legítimo e Sintético</h3>
            <p>Oferecemos revestimento completo de bancos em couro legítimo ou sintético, proporcionando mais sofisticação, conforto e valorização ao veículo. Trabalhamos com materiais de alta qualidade e diversas opções de cores, além de personalização de costuras e acabamentos.</p>
          </div>
        </div>

        <div className="servico">
          <div className="img-container">
            <img src={bancoMoto} alt="Bancos de Moto" />
          </div>
          <div className="descricao">
            <h3>Bancos de Motocicletas</h3>
            <p>Reforma e personalização de bancos de motos de todos os estilos. Utilizamos espumas de alta densidade e materiais antiderrapantes para garantir máximo conforto em viagens longas e um visual exclusivo para sua moto.</p>
          </div>
        </div>

        <div className="servico">
          <div className="img-container">
            <img src={charrete} alt="Estofamento de Charretes" />
          </div>
          <div className="descricao">
            <h3>Estofamento de Charretes</h3>
            <p>Realizamos estofamento completo para charretes, utilizando materiais resistentes ao uso externo e às variações climáticas. Nosso trabalho combina tradição artesanal com técnicas modernas para durabilidade e estética.</p>
          </div>
        </div>

        <div className="servico">
          <div className="img-container">
            <img src={volante} alt="Revestimento de Volantes" />
          </div>
          <div className="descricao">
            <h3>Revestimento de Volantes</h3>
            <p>Fazemos revestimento de volantes com costura manual e acabamento profissional. O serviço proporciona melhor aderência, conforto ao dirigir e renovação do interior do carro, com opções de personalização.</p>
          </div>
        </div>

        <div className="servico">
          <div className="img-container">
            <img src={teto} alt="Revestimento de Teto" />
          </div>
          <div className="descricao">
            <h3>Revestimento de Teto</h3>
            <p>Especializados na recuperação de tetos automotivos para veículos modernos e clássicos. Utilizamos materiais de qualidade para garantir um acabamento uniforme e elegante no interior do veículo.</p>
          </div>
        </div>

      </section>

      <Footer />
    </>
  )
}