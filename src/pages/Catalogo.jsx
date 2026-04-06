import React, { useState } from "react" // Importamos o useState para o zoom
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import bancoCouro from "../assets/bancodecourocataloco.jpg"
import charrete from "../assets/charrete.jpg"
import volante from "../assets/volantedocataloco.jpg"
import teto from "../assets/teto.jpg"
import bancoMoto from "../assets/bancodemoto.jpg"

export default function Catalogo() {
  // ESSA É A LÓGICA DO ZOOM:
  const [fotoAmpliada, setFotoAmpliada] = useState(null);

  return (
    <div className="page-navbar">
      <Navbar />

      <section className="catalogo">
        {/* Item 1 */}
        <div className="servico">
          <div className="img-container" onClick={() => setFotoAmpliada(bancoCouro)}>
            <img src={bancoCouro} alt="Bancos em Couro" />
          </div>
          <div className="descricao">
            <h3>Bancos em Couro Legítimo e Sintético</h3>
            <p>Oferecemos revestimento completo de bancos em couro legítimo ou sintético, proporcionando mais sofisticação, conforto e valorização ao veículo. Trabalhamos com materiais de alta qualidade e diversas opções de cores, além de personalização de costuras e acabamentos.</p>
          </div>
        </div>

        {/* Item 2 */}
        <div className="servico">
          <div className="img-container" onClick={() => setFotoAmpliada(bancoMoto)}>
            <img src={bancoMoto} alt="Bancos de Moto" />
          </div>
          <div className="descricao">
            <h3>Bancos de Motocicletas</h3>
            <p>Reforma e personalização de bancos de motos de todos os estilos. Utilizamos espumas de alta densidade e materiais antiderrapantes para garantir máximo conforto em viagens longas e um visual exclusivo para sua moto.</p>
          </div>
        </div>

        {/* Item 3 */}
        <div className="servico">
          <div className="img-container" onClick={() => setFotoAmpliada(charrete)}>
            <img src={charrete} alt="Estofamento de Charretes" />
          </div>
          <div className="descricao">
            <h3>Estofamento de Charretes</h3>
            <p>Realizamos estofamento completo para charretes, utilizando materiais resistentes ao uso externo e às variações climáticas. Nosso trabalho combina tradição artesanal com técnicas modernas para durabilidade e estética.</p>
          </div>
        </div>

        {/* Item 4 */}
        <div className="servico">
          <div className="img-container" onClick={() => setFotoAmpliada(volante)}>
            <img src={volante} alt="Revestimento de Volantes" />
          </div>
          <div className="descricao">
            <h3>Revestimento de Volantes</h3>
            <p>Fazemos revestimento de volantes com costura manual e acabamento profissional. O serviço proporciona melhor aderência, conforto ao dirigir e renovação do interior do carro, com opções de personalização.</p>
          </div>
        </div>

        {/* Item 5 */}
        <div className="servico">
          <div className="img-container" onClick={() => setFotoAmpliada(teto)}>
            <img src={teto} alt="Revestimento de Teto" />
          </div>
          <div className="descricao">
            <h3>Revestimento de Teto</h3>
            <p>Especializados na recuperação de tetos automotivos para veículos modernos e clássicos. Utilizamos materiais de qualidade para garantir um acabamento uniforme e elegante no interior do veículo.</p>
          </div>
        </div>
      </section>

      {/* MODAL DE TELA CHEIA */}
      {fotoAmpliada && (
        <div className="modal-fullscreen" onClick={() => setFotoAmpliada(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <span className="fechar-zoom" onClick={() => setFotoAmpliada(null)}>&times;</span>
            <img src={fotoAmpliada} alt="Foto em tela cheia" />
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}