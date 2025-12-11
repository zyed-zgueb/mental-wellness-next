"use client";

import { Lock } from "lucide-react";
import { UserProfile } from "@/components/auth/user-profile";
import { useSession } from "@/lib/auth-client";

export default function ChatPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Accès restreint</h1>
            <p className="text-muted-foreground mb-6">
              Vous devez vous connecter pour accéder au chat IA
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Chat IA</h1>
      </div>

      <div className="text-center py-20 text-muted-foreground">
        <p className="text-lg">
          Le chat avec votre assistant IA sera bientôt disponible.
        </p>
      </div>
    </div>
  );
}
