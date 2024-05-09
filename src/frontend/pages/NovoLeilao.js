import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Image,
  Picker,
  ScrollView,
} from "react-native";
import { Button, Headline } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Footer from "./../navegations/Footer";
import novoLeilaoStyles from "./../css/NovoLeilaoStyles";

const NovoLeilao = () => {
  const navigation = useNavigation();

  const [nomeProduto, setNomeProduto] = useState("");
  const [descricaoProduto, setDescricaoProduto] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [precoInicial, setPrecoInicial] = useState("");
  const [duracaoDias, setDuracaoDias] = useState("");
  const [duracaoHoras, setDuracaoHoras] = useState("");
  const [duracaoMinutos, setDuracaoMinutos] = useState("");
  const [urlImagemProduto, setUrlImagemProduto] = useState("");
  const [mensagemSalvo, setMensagemSalvo] = useState("");
  const [precoAtual, setPrecoAtual] = useState(precoInicial || 0);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Fetch categories from the database
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://192.168.1.106:3000/categorias");
        console.log("Buscou categoria:", response);
        if (response.ok) {
          const data = await response.json();
          setCategorias(data.categorias);
          console.log("Categorias armazenadas:", data.categorias); 
        } else {
          throw new Error("Erro ao buscar categorias");
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSalvarAlteracoesPress = async () => {
    try {
      const dataInicioFim = new Date();

      const novoLeilao = {
        nomeProduto,
        descricaoProduto,
        categoriaSelecionada,
        precoInicial,
        duracao: `${duracaoDias} dias ${duracaoHoras} horas ${duracaoMinutos} minutos`,
        urlImagemProduto,
        dataInicio: dataInicioFim,
        dataFim: dataInicioFim,
        precoAtual,
      };
      console.log("Dados do novo leilão:", novoLeilao);

      const response = await fetch("http://192.168.1.106:3000/leilao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoLeilao),
      });
      console.log("Resposta da requisição:", response);

      if (response.ok) {
        setMensagemSalvo("Leilão salvo com sucesso!");
        setTimeout(() => {
          navigation.navigate("MeusLeiloes");
        }, 2000);
      } else {
        throw new Error("Erro ao salvar o leilão");
      }
    } catch (error) {
      console.error("Erro ao salvar o leilão:", error);
    }
  };

  return (
    <View style={novoLeilaoStyles.container}>
      <ScrollView
        style={novoLeilaoStyles.scrollContent}
        contentContainerStyle={novoLeilaoStyles.contentContainer}
      >
        <View style={novoLeilaoStyles.head}>
          <Button
            icon="chevron-left"
            onPress={() => navigation.goBack()}
          ></Button>

          <Headline style={novoLeilaoStyles.textHeader}>Novo Leilão</Headline>
        </View>

        <Pressable style={novoLeilaoStyles.uploadButton}>
          {urlImagemProduto ? (
            <Image
              source={{ uri: urlImagemProduto }}
              style={novoLeilaoStyles.imagemPreview}
            />
          ) : (
            <View style={novoLeilaoStyles.imagemContainer}>
              <Image
                source={require("./../assets/cloud-computing.png")}
                style={novoLeilaoStyles.imagemPreviewBase}
              />
              <Text style={novoLeilaoStyles.uploadButtonText}>
                Carregar Imagem
              </Text>
            </View>
          )}
        </Pressable>

        <View style={novoLeilaoStyles.inputBox}>
          <Text style={novoLeilaoStyles.inputTitle}>URL da Imagem</Text>
          <TextInput
            value={urlImagemProduto}
            onChangeText={(text) => setUrlImagemProduto(text)}
            style={novoLeilaoStyles.inputText}
          />
        </View>
        <View style={novoLeilaoStyles.inputBox}>
          <Text style={novoLeilaoStyles.inputTitle}>Nome</Text>
          <TextInput
            value={nomeProduto}
            onChangeText={(text) => setNomeProduto(text)}
            style={novoLeilaoStyles.inputText}
          />
        </View>
        <View style={novoLeilaoStyles.inputBox}>
          <Text style={novoLeilaoStyles.inputTitle}>Descrição</Text>
          <TextInput
            value={descricaoProduto}
            onChangeText={(text) => setDescricaoProduto(text)}
            style={novoLeilaoStyles.inputText}
          />
        </View>
        <View style={novoLeilaoStyles.inputBox}>
          <Text style={novoLeilaoStyles.inputTitle}>Categoria</Text>
          {categorias.length > 0 && (
            <Picker
              onValueChange={(itemValue, itemIndex) => {
              console.log(itemValue);
              setCategoriaSelecionada(itemValue);
            }}
              selectedValue={categoriaSelecionada}
              mode='dropdown'
            >
              {categorias.map((cat,index) => (
                <Picker.Item
                  key={cat.id}
                  label={cat.descricaoCategoriaProduto}
                  value={cat.id}
                />
              ))}
            </Picker>
          )}
        </View>
        <View style={novoLeilaoStyles.inputBox}>
          <Text style={novoLeilaoStyles.inputTitle}>Lance mínimo</Text>
          <TextInput
            value={precoInicial}
            onChangeText={(text) => {
              setPrecoInicial(text);
              setPrecoAtual(text);
            }}
            style={novoLeilaoStyles.inputText}
          />
        </View>
        <View style={novoLeilaoStyles.duracaoContainer}>
          <Text style={novoLeilaoStyles.duracaoLabel}>Duração</Text>
          <View style={novoLeilaoStyles.duracaoInputContainer}>
            <View style={novoLeilaoStyles.duracaoInput}>
              <TextInput
                placeholder="00"
                value={duracaoDias}
                onChangeText={(text) => setDuracaoDias(text)}
                style={novoLeilaoStyles.duracaoPlaceholder}
              />
              <Text>dias</Text>
            </View>
            <View style={novoLeilaoStyles.duracaoInput}>
              <TextInput
                placeholder="00"
                value={duracaoHoras}
                onChangeText={(text) => setDuracaoHoras(text)}
                style={novoLeilaoStyles.duracaoPlaceholder}
              />
              <Text>horas</Text>
            </View>
            <View style={novoLeilaoStyles.duracaoInput}>
              <TextInput
                placeholder="00"
                value={duracaoMinutos}
                onChangeText={(text) => setDuracaoMinutos(text)}
                style={novoLeilaoStyles.duracaoPlaceholder}
              />
              <Text>minutos</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={novoLeilaoStyles.button}
          onPress={handleSalvarAlteracoesPress}
        >
          <Text style={novoLeilaoStyles.buttonText}>Salvar Alterações</Text>
        </Pressable>

        {mensagemSalvo ? <Text>{mensagemSalvo}</Text> : null}
      </ScrollView>
      <View>
        <Footer />
      </View>
    </View>
  );
};

export default NovoLeilao;
