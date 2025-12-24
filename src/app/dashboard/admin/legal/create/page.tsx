import AdminLegalEditorClient from "../AdminLegalEditorClient";

export const metadata = {
  title: "Create Legal Page",
};

export default function CreateLegalPage() {
  return <AdminLegalEditorClient mode="create" />;
}
