import { AtivoToInsert } from "@/types";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type AtivoFormProps = {
  inventarioId: number;
  onSubmit: (data: AtivoToInsert) => void | Promise<void>;
};

export default function AtivoForm({ inventarioId, onSubmit }: AtivoFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AtivoToInsert>({
    defaultValues: {
      inventario_id: inventarioId,
      codigo_ativo: "",
      descricao: "",
      comentarios: "",
      categoria: "",
      centroDeCustos: "",
      subdivisao: "",
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>+</Text>
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.title}>Novo ativo</Text>
            <Text style={styles.subtitle}>
              Cadastre um novo ativo no inventário
            </Text>
          </View>
        </View>

        {/* Formulário */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informações do ativo</Text>
            <Text style={styles.requiredLegend}>* Obrigatório</Text>
          </View>

          {/* Código */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Código <Text style={styles.required}>*</Text>
            </Text>

            <Controller
              control={control}
              name="codigo_ativo"
              rules={{
                required: "Código é obrigatório",
                pattern: {
                  value: /^[a-zA-Z0-9 ]+$/,
                  message: "Aceita apenas letras e números",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.codigo_ativo && styles.inputError,
                  ]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ex.: PAT-00123"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                />
              )}
            />

            {errors.codigo_ativo && (
              <Text style={styles.error}>{errors.codigo_ativo.message}</Text>
            )}
          </View>

          {/* Descrição */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Descrição <Text style={styles.required}>*</Text>
            </Text>

            <Controller
              control={control}
              name="descricao"
              rules={{
                required: "Descrição é obrigatória",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.descricao && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ex.: Notebook Dell Latitude"
                  placeholderTextColor="#9CA3AF"
                />
              )}
            />

            {errors.descricao && (
              <Text style={styles.error}>{errors.descricao.message}</Text>
            )}
          </View>

          {/* Centro de custos */}
          <View style={styles.field}>
            <Text style={styles.label}>Categoria</Text>

            <Controller
              control={control}
              name="categoria"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value ?? ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Categoria"
                  placeholderTextColor="#9CA3AF"
                />
              )}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Centro de custos <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              name="centroDeCustos"
              rules={{
                required: "Centro de custos é obrigatório",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.centroDeCustos && styles.inputError,
                  ]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ex.: 001"
                  placeholderTextColor="#9CA3AF"
                />
              )}
            />
            {errors.centroDeCustos && (
              <Text style={styles.error}>{errors.centroDeCustos.message}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Subdivisão</Text>
            <Controller
              control={control}
              name="subdivisao"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value ?? ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Subdivisão"
                  placeholderTextColor="#9CA3AF"
                />
              )}
            />
          </View>

          {/* Comentários */}
          <View style={styles.field}>
            <Text style={styles.label}>Comentários</Text>

            <Controller
              control={control}
              name="comentarios"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={value ?? ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Adicione alguma observação sobre o ativo..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              )}
            />
          </View>
        </View>

        {/* Informação */}
        <View style={styles.infoBox}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>i</Text>
          </View>

          <Text style={styles.infoText}>
            Os campos marcados com <Text style={styles.bold}>*</Text> são
            obrigatórios.
          </Text>
        </View>

        {/* Botão */}
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.submitButtonPressed,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Cadastrando..." : "Cadastrar ativo"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  headerIconText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "300",
    lineHeight: 32,
  },

  headerContent: {
    flex: 1,
  },

  title: {
    color: "#111827",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
  },

  subtitle: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
  },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  sectionTitle: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "700",
  },

  requiredLegend: {
    color: "#9CA3AF",
    fontSize: 12,
  },

  // Fields
  field: {
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 0,
  },

  halfField: {
    flex: 1,
    marginBottom: 18,
  },

  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 7,
  },

  required: {
    color: "#EF4444",
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: "#111827",
    fontSize: 15,
  },

  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },

  textArea: {
    minHeight: 120,
    paddingTop: 13,
  },

  error: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 2,
  },

  // Info
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  infoIconText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  infoText: {
    flex: 1,
    color: "#1E40AF",
    fontSize: 12,
    lineHeight: 18,
  },

  bold: {
    fontWeight: "700",
  },

  // Button
  submitButton: {
    height: 52,
    borderRadius: 11,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  submitButtonPressed: {
    backgroundColor: "#1D4ED8",
    transform: [{ scale: 0.99 }],
  },

  submitButtonDisabled: {
    backgroundColor: "#93C5FD",
    shadowOpacity: 0,
    elevation: 0,
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
