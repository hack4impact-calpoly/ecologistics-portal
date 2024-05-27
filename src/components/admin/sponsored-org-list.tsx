import { OrganizationWithUser } from "@/app/sponsored-organizations/page";
import SponsorCard from "@/components/admin/sponsored-org-card";

interface SponsoredOrgListProps {
  organizations: OrganizationWithUser[];
  updateCount: { [key: string]: number };
}

export const SponsoredOrgList: React.FunctionComponent<SponsoredOrgListProps> = ({ organizations, updateCount }) => {
  return (
    <>
      <style jsx>{`
        .custom-grid {
          display: grid;
          gap: 1.5rem; /* Adjust gap as needed */
          justify-content: center; /* Center the grid horizontally */
          justify-items: center; /* Center the content within each grid item */
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }

        @media (min-width: 875px) {
          .custom-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1175px) {
          .custom-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (min-width: 1475px) {
          .custom-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
      `}</style>
      <div className="px-8 max-w-[1300px] mx-auto flex justify-center">
        <div className="custom-grid">
          {organizations.map((organization, index) => (
            <div key={index}>
              <SponsorCard
                organizationData={organization}
                toApprove={organization.approved === false}
                updates={updateCount[organization.clerkUserId] || 0}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
