import { resend } from "@/lib/resend/client";
import { workspaceMemberRoleLabels, type WorkspaceMemberRole } from "@/lib/domain";

type SendInviteEmailParams = {
  to: string;
  workspaceName: string;
  inviterName: string;
  role: WorkspaceMemberRole;
  acceptUrl: string;
};

export async function sendInviteEmail({
  to,
  workspaceName,
  inviterName,
  role,
  acceptUrl,
}: SendInviteEmailParams) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `${inviterName} convidou você para o workspace ${workspaceName} no PipeFlow CRM`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="font-size: 18px;">Você foi convidado para o PipeFlow CRM</h1>
        <p>
          <strong>${inviterName}</strong> convidou você para participar do
          workspace <strong>${workspaceName}</strong> como
          <strong>${workspaceMemberRoleLabels[role]}</strong>.
        </p>
        <p>
          <a
            href="${acceptUrl}"
            style="display: inline-block; padding: 10px 20px; background: #2563EB; color: #fff; border-radius: 6px; text-decoration: none;"
          >
            Aceitar convite
          </a>
        </p>
        <p style="color: #64748b; font-size: 13px;">
          Este convite expira em 7 dias. Se você não esperava este e-mail,
          pode ignorá-lo.
        </p>
      </div>
    `,
  });
}
