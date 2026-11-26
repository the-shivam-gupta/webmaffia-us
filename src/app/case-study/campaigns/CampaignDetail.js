import Image from "next/image";
import CampaignHeroVideo from "@/components/CampaignHeroVideo";
import { getStrapiAssetUrl } from "@/lib/strapiPage";

export default function CampaignDetail({ campaign }) {
    const posterUrl = getStrapiAssetUrl(campaign.poster);
    const videoUrl = campaign.video ? getStrapiAssetUrl(campaign.video) : null;
    const recognition = campaign.recognition ?? [];

    return (
        <main className="wrapper campaigns">
            <div className="ml-setter campaign_page">
                <section data-section="hero_section" className="hero_section campaign_hero flex">
                    <div className="campaign_content">
                        <div className="sub_title">{campaign.tagLine}</div>
                        <h1>{campaign.heading}</h1>
                        <div dangerouslySetInnerHTML={{ __html: campaign.description }} />
                        {recognition.length > 0 && (
                            <>
                                <h4>Recognition</h4>
                                <div className="campaign_awards">
                                    {recognition.map((award) => (
                                        <article
                                            className="campaign_award_card"
                                            key={`${award.title}-${award.type}`}
                                        >
                                            {award.logo && (
                                                <div className="campaign_award_card__media">
                                                    <Image
                                                        src={getStrapiAssetUrl(award.logo)}
                                                        alt={award.logo.alternativeText || ""}
                                                        width={award.logo.width || 205}
                                                        height={award.logo.height || 267}
                                                        className="campaign_award_card__img"
                                                    />
                                                </div>
                                            )}
                                            <div className="campaign_award_card__body">
                                                <div className="campaign_award_card__meta">
                                                    <span className="campaign_award_card__type">
                                                        {award.type}
                                                    </span>
                                                </div>
                                                <h3 className="campaign_award_card__title">
                                                    {award.title}
                                                </h3>
                                                <p className="campaign_award_card__desc">
                                                    {award.description}
                                                </p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <CampaignHeroVideo poster={posterUrl} videoSrc={videoUrl} />
                </section>
            </div>
        </main>
    );
}
