import { useState, type ReactNode } from "react";
import {
  dashboardRatios,
  emergencyFund,
  feeDrag,
  financingPlan,
  funnel,
  gainAfterTax,
  inflationEffect,
  investmentPayback,
  priceFromCost,
  recoveryGain,
  rentalYield,
  retirementSaving,
  unitEconomicsLtv,
} from "../lib/lessonModelsMore";
import {
  Choices,
  CompareBars,
  Range,
  SortingGame,
  euros,
  percent,
  type SortingItem,
} from "./LessonScenesMore";

/** The shared frame of a numeric scene. */
function Scene({
  label,
  eyebrow,
  title,
  fiction,
  number,
  caption,
  detail,
  children,
  reading,
  takeaway,
}: {
  label: string;
  eyebrow: string;
  title: string;
  fiction: string;
  number: string;
  caption: string;
  detail: ReactNode;
  children: ReactNode;
  reading?: ReactNode;
  takeaway: ReactNode;
}) {
  return (
    <section className="scene-workbench scene-micro" aria-label={label}>
      <div className="scene-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h3>{title}</h3>
        </div>
        <span className="scene-fiction">{fiction}</span>
      </div>
      <div className="scene-number-line">
        <div>
          <strong className="scene-number" aria-live="polite">
            {number}
          </strong>
          <span>{caption}</span>
        </div>
        <p>{detail}</p>
      </div>
      {children}
      {reading && (
        <p className="financial-reading" aria-live="polite">
          <span>{reading}</span>
        </p>
      )}
      <p className="scene-takeaway">{takeaway}</p>
    </section>
  );
}

/* ---------- Finance personnelle ---------- */

export function EmergencyFundScene() {
  const [expenses, setExpenses] = useState(1_500);
  const [months, setMonths] = useState(4);
  const [saving, setSaving] = useState(200);
  const result = emergencyFund(expenses, months, 1_000, saving);
  return (
    <Scene
      label="Calculer son épargne de précaution"
      eyebrow="UN COUSSIN AVANT TOUT"
      title="Combien de mois pourriez-vous tenir ?"
      fiction="1 000 € déjà de côté · fictif"
      number={euros.format(result.target)}
      caption={`de réserve visée, soit ${months} mois de dépenses`}
      detail={
        <>
          Il manque <strong>{euros.format(result.missing)}</strong>. Placée sur
          un livret disponible, cette réserve absorbe une panne, une baisse de
          revenus ou une facture imprévue sans crédit.
        </>
      }
      reading={
        <>
          <strong>À {euros.format(saving)} par mois :</strong>{" "}
          {result.monthsToReach === null
            ? "sans versement, la réserve ne se construit pas."
            : result.monthsToReach === 0
              ? "la réserve est déjà constituée."
              : `objectif atteint en ${result.monthsToReach} mois.`}
        </>
      }
      takeaway={
        <>
          Repère courant : 3 à 6 mois de dépenses, davantage pour un revenu
          irrégulier.{" "}
          <strong>La réserve passe avant les placements risqués.</strong>
        </>
      }
    >
      <Choices
        label="Mois de dépenses visés"
        value={months}
        onChange={setMonths}
        options={[3, 4, 6].map((value) => ({
          value,
          label: `${value} mois`,
        }))}
      />
      <Range
        label="Dépenses mensuelles"
        shown={euros.format(expenses)}
        ariaLabel="Dépenses mensuelles en euros"
        min={800}
        max={4_000}
        step={100}
        value={expenses}
        onChange={setExpenses}
      />
      <Range
        label="Épargne programmée par mois"
        shown={euros.format(saving)}
        ariaLabel="Épargne mensuelle en euros"
        min={0}
        max={800}
        step={25}
        value={saving}
        onChange={setSaving}
      />
    </Scene>
  );
}

export function InflationScene() {
  const [inflation, setInflation] = useState(2);
  const [years, setYears] = useState(10);
  const [raise, setRaise] = useState(1.5);
  const result = inflationEffect(1_000, inflation / 100, years, raise / 100);
  return (
    <Scene
      label="Mesurer l’effet de l’inflation"
      eyebrow="LE PRIX DU TEMPS"
      title="1 000 € aujourd’hui, combien demain ?"
      fiction="Inflation constante · fictif"
      number={euros.format(result.value)}
      caption={`de pouvoir d’achat dans ${years} ans`}
      detail={
        <>
          À {inflation.toLocaleString("fr-FR")}
          {" "}% par an, 1 000 € laissés sur un compte non rémunéré perdent{" "}
          <strong>{euros.format(result.lost)}</strong> de pouvoir d’achat.
        </>
      }
      reading={
        <>
          <strong>
            Une hausse de salaire de {raise.toLocaleString("fr-FR")}
            {" "}% :
          </strong>{" "}
          {result.realRaise >= 0
            ? `gain réel de ${percent(result.realRaise, 1)} après inflation.`
            : `perte réelle de ${percent(-result.realRaise, 1)} : le salaire augmente moins vite que les prix.`}
        </>
      }
      takeaway={
        <>
          Votre inflation personnelle dépend de ce que vous achetez (loyer,
          énergie, transports).{" "}
          <strong>Un salaire réel se lit après inflation.</strong>
        </>
      }
    >
      <Range
        label="Inflation annuelle"
        shown={`${inflation.toLocaleString("fr-FR")} %`}
        ariaLabel="Inflation annuelle en pourcentage"
        min={0}
        max={8}
        step={0.5}
        value={inflation}
        onChange={setInflation}
      />
      <Range
        label="Années"
        shown={`${years} ans`}
        ariaLabel="Nombre d’années"
        min={1}
        max={30}
        step={1}
        value={years}
        onChange={setYears}
      />
      <Range
        label="Hausse de salaire sur un an"
        shown={`${raise.toLocaleString("fr-FR")} %`}
        ariaLabel="Hausse de salaire en pourcentage"
        min={0}
        max={6}
        step={0.5}
        value={raise}
        onChange={setRaise}
      />
    </Scene>
  );
}

export function RetirementScene() {
  const [monthly, setMonthly] = useState(100);
  const [years, setYears] = useState(30);
  const result = retirementSaving(monthly, years, 0.04);
  return (
    <Scene
      label="Voir ce que produit une épargne retraite régulière"
      eyebrow="LE TEMPS TRAVAILLE"
      title="Commencer tôt compte plus que verser beaucoup."
      fiction="Rendement fictif de 4 % par an"
      number={euros.format(result.capital)}
      caption={`au bout de ${years} ans`}
      detail={
        <>
          Vous versez <strong>{euros.format(result.paid)}</strong> ; les
          intérêts composés ajoutent{" "}
          <strong>{euros.format(result.gains)}</strong>.
        </>
      }
      reading={
        <>
          <strong>Repère :</strong> la retraite de base fonctionne par
          répartition (les cotisations d’aujourd’hui paient les pensions
          d’aujourd’hui) ; une épargne comme le PER fonctionne par
          capitalisation, comme ici.
        </>
      }
      takeaway={
        <>
          Rendement non garanti, avant frais et fiscalité ; un PER bloque
          l’épargne jusqu’à la retraite, sauf cas prévus.{" "}
          <strong>
            Dix ans de plus pèsent souvent plus qu’un versement doublé.
          </strong>
        </>
      }
    >
      <CompareBars
        rows={[
          {
            label: "Versé",
            amount: result.paid,
            display: euros.format(result.paid),
            className: "is-soft",
          },
          {
            label: "Capital final",
            amount: result.capital,
            display: euros.format(result.capital),
            className: "is-silver",
          },
        ]}
      />
      <Range
        label="Versement mensuel"
        shown={euros.format(monthly)}
        ariaLabel="Versement mensuel en euros"
        min={25}
        max={500}
        step={25}
        value={monthly}
        onChange={setMonthly}
      />
      <Range
        label="Durée jusqu’à la retraite"
        shown={`${years} ans`}
        ariaLabel="Durée en années"
        min={5}
        max={40}
        step={1}
        value={years}
        onChange={setYears}
      />
    </Scene>
  );
}

/* ---------- Investissement ---------- */

export function FeeDragScene() {
  const [years, setYears] = useState(20);
  const result = feeDrag(10_000, 0.05, years, 0.002, 0.02);
  return (
    <Scene
      label="Comparer un fonds à 0,2 % et à 2 % de frais"
      eyebrow="LES FRAIS SE COMPOSENT"
      title="Même marché, frais différents."
      fiction="10 000 € · 5 % brut par an · fictif"
      number={euros.format(result.gap)}
      caption={`d’écart après ${years} ans`}
      detail={
        <>
          Un fonds indiciel (ETF) à 0,2 % de frais annuels contre un fonds à 2 %
          : la différence se cumule chaque année, sur un capital qui grossit.
        </>
      }
      takeaway={
        <>
          Les frais figurent dans le document d’informations clés (DIC). Exemple
          pédagogique, aucun conseil en investissement.{" "}
          <strong>
            Le support (le fonds) et l’enveloppe (PEA, assurance-vie,
            compte-titres) ont chacun leurs frais.
          </strong>
        </>
      }
    >
      <CompareBars
        rows={[
          {
            label: "Frais 0,2 %",
            amount: result.low,
            display: euros.format(result.low),
            className: "is-silver",
          },
          {
            label: "Frais 2 %",
            amount: result.high,
            display: euros.format(result.high),
            className: "is-soft",
          },
        ]}
      />
      <Range
        label="Durée de placement"
        shown={`${years} ans`}
        ariaLabel="Durée en années"
        min={1}
        max={30}
        step={1}
        value={years}
        onChange={setYears}
      />
    </Scene>
  );
}

export function RentalYieldScene() {
  const [rent, setRent] = useState(700);
  const [vacancy, setVacancy] = useState(1);
  const result = rentalYield({
    price: 150_000,
    feesRate: 0.08,
    monthlyRent: rent,
    yearlyCharges: 2_000,
    vacantMonths: vacancy,
  });
  return (
    <Scene
      label="Passer du rendement brut au rendement net"
      eyebrow="DU BRUT AU NET"
      title="Le rendement affiché n’est pas celui que vous touchez."
      fiction="150 000 € + 8 % de frais · fictif"
      number={percent(result.net, 1)}
      caption="de rendement net, avant impôt"
      detail={
        <>
          Rendement brut affiché : <strong>{percent(result.gross, 1)}</strong>.
          Après frais d’achat, 2 000 € de charges et de taxe foncière, et{" "}
          {vacancy} mois sans locataire, il reste{" "}
          <strong>{euros.format(result.netRent)}</strong> de loyers nets par an.
        </>
      }
      takeaway={
        <>
          Une SCPI ajoute des frais de souscription (souvent 8 à 12 %) et se
          revend moins vite qu’une action.{" "}
          <strong>Comparez toujours des rendements nets, après impôt.</strong>
        </>
      }
    >
      <Range
        label="Loyer mensuel"
        shown={euros.format(rent)}
        ariaLabel="Loyer mensuel en euros"
        min={400}
        max={1_200}
        step={25}
        value={rent}
        onChange={setRent}
      />
      <Range
        label="Mois sans locataire par an"
        shown={`${vacancy} mois`}
        ariaLabel="Mois de vacance par an"
        min={0}
        max={4}
        step={1}
        value={vacancy}
        onChange={setVacancy}
      />
    </Scene>
  );
}

export function CryptoRecoveryScene() {
  const [loss, setLoss] = useState(50);
  const gain = recoveryGain(loss / 100);
  return (
    <Scene
      label="Mesurer ce qu’il faut regagner après une chute"
      eyebrow="L’ASYMÉTRIE DES PERTES"
      title="Perdre 50 %, c’est devoir gagner 100 %."
      fiction="Exemple de calcul"
      number={`+${percent(gain)}`}
      caption={`de hausse nécessaire pour effacer une baisse de ${loss} %`}
      detail={
        <>
          1 000 € tombés à {euros.format(1_000 * (1 - loss / 100))} doivent être
          multipliés par{" "}
          {(1 / (1 - loss / 100)).toLocaleString("fr-FR", {
            maximumFractionDigits: 1,
          })}{" "}
          pour revenir à leur valeur de départ.
        </>
      }
      takeaway={
        <>
          Des crypto-actifs ont déjà perdu plus de 70 % en quelques mois ;
          plateformes et conservation ajoutent leurs propres risques.{" "}
          <strong>N’y placez que ce que vous pouvez perdre entièrement.</strong>
        </>
      }
    >
      <Range
        label="Baisse subie"
        shown={`${loss} %`}
        ariaLabel="Baisse en pourcentage"
        min={10}
        max={90}
        step={5}
        value={loss}
        onChange={setLoss}
      />
    </Scene>
  );
}

export function InvestmentTaxScene() {
  const [gain, setGain] = useState(10_000);
  const result = gainAfterTax(gain);
  return (
    <Scene
      label="Comparer un gain après impôt selon l’enveloppe"
      eyebrow="APRÈS IMPÔT"
      title="Le même gain, deux enveloppes."
      fiction="Taux 2026 · à vérifier"
      number={euros.format(result.peaAfterFiveYears - result.securitiesAccount)}
      caption="de plus dans un PEA de plus de cinq ans"
      detail={
        <>
          Sur un compte-titres, la flat tax (prélèvement forfaitaire unique) de
          31,4 % s’applique. Dans un PEA de plus de cinq ans, seuls les
          prélèvements sociaux de 18,6 % restent dus.
        </>
      }
      takeaway={
        <>
          Taux 2026 issus de sources concordantes, à vérifier sur impots.gouv.fr
          ; l’assurance-vie suit d’autres règles (prélèvements sociaux de
          17,2 %, abattement après huit ans).{" "}
          <strong>L’enveloppe compte autant que le placement.</strong>
        </>
      }
    >
      <CompareBars
        rows={[
          {
            label: "Compte-titres",
            amount: result.securitiesAccount,
            display: euros.format(result.securitiesAccount),
            className: "is-soft",
          },
          {
            label: "PEA > 5 ans",
            amount: result.peaAfterFiveYears,
            display: euros.format(result.peaAfterFiveYears),
            className: "is-silver",
          },
        ]}
      />
      <Range
        label="Plus-value réalisée"
        shown={euros.format(gain)}
        ariaLabel="Plus-value en euros"
        min={1_000}
        max={50_000}
        step={1_000}
        value={gain}
        onChange={setGain}
      />
    </Scene>
  );
}

/* ---------- Entrepreneuriat ---------- */

export function LifetimeValueScene() {
  const [basket, setBasket] = useState(50);
  const [cac, setCac] = useState(60);
  const result = unitEconomicsLtv(basket, 0.4, 4, 2, cac);
  return (
    <Scene
      label="Comparer la valeur d’un client à son coût d’acquisition"
      eyebrow="UN CLIENT RAPPORTE-T-IL ?"
      title="Ce qu’un client rapporte contre ce qu’il coûte."
      fiction="4 achats par an pendant 2 ans · 40 % de marge"
      number={
        result.ratio === null
          ? "—"
          : `${result.ratio.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} ×`
      }
      caption="valeur d’un client ÷ coût pour l’obtenir"
      detail={
        <>
          Un client laisse <strong>{euros.format(result.lifetimeValue)}</strong>{" "}
          de marge sur sa durée de vie, pour {euros.format(cac)} de publicité et
          de démarchage.
        </>
      }
      reading={
        <>
          <strong>Délai de récupération :</strong>{" "}
          {result.paybackMonths === null
            ? "aucun."
            : `${result.paybackMonths} mois de marge pour rembourser l’acquisition.`}{" "}
          {result.ratio !== null && result.ratio < 1
            ? "Chaque nouveau client fait perdre de l’argent."
            : result.ratio !== null && result.ratio < 3
              ? "Fragile : peu de marge pour les imprévus."
              : "Le modèle supporte la croissance."}
        </>
      }
      takeaway={
        <>
          Repère courant : une valeur client d’au moins trois fois son coût
          d’acquisition.{" "}
          <strong>
            Ces chiffres reposent sur des hypothèses à vérifier avec de vraies
            ventes.
          </strong>
        </>
      }
    >
      <Range
        label="Panier moyen"
        shown={euros.format(basket)}
        ariaLabel="Panier moyen en euros"
        min={10}
        max={200}
        step={5}
        value={basket}
        onChange={setBasket}
      />
      <Range
        label="Coût d’acquisition d’un client"
        shown={euros.format(cac)}
        ariaLabel="Coût d’acquisition en euros"
        min={5}
        max={300}
        step={5}
        value={cac}
        onChange={setCac}
      />
    </Scene>
  );
}

export function FunnelScene() {
  const [toLead, setToLead] = useState(5);
  const [toCustomer, setToCustomer] = useState(20);
  const result = funnel(2_000, toLead / 100, toCustomer / 100);
  const doubled = funnel(
    2_000,
    toLead / 100,
    Math.min(1, (toCustomer * 2) / 100),
  );
  return (
    <Scene
      label="Suivre un entonnoir de conversion"
      eyebrow="DE LA VISITE AU CLIENT"
      title="Chaque étape filtre."
      fiction="2 000 visiteurs par mois · fictif"
      number={result.customers.toLocaleString("fr-FR")}
      caption="clients par mois"
      detail={
        <>
          2 000 visiteurs → <strong>{result.leads}</strong> contacts →{" "}
          <strong>{result.customers}</strong> clients.
        </>
      }
      reading={
        <>
          <strong>Doubler la conversion en client</strong> donne{" "}
          {doubled.customers} clients, souvent moins cher que doubler les
          visiteurs.
        </>
      }
      takeaway={
        <>
          Mesurez chaque étape avant d’acheter de la publicité.{" "}
          <strong>
            Un message clair fait souvent plus qu’un nouveau canal.
          </strong>
        </>
      }
    >
      <CompareBars
        rows={[
          {
            label: "Visiteurs",
            amount: 2_000,
            display: "2 000",
            className: "is-soft",
          },
          {
            label: "Contacts",
            amount: result.leads,
            display: String(result.leads),
            className: "is-solid",
          },
          {
            label: "Clients",
            amount: result.customers,
            display: String(result.customers),
            className: "is-silver",
          },
        ]}
      />
      <Range
        label="Visiteurs qui laissent un contact"
        shown={`${toLead} %`}
        ariaLabel="Taux de contact en pourcentage"
        min={1}
        max={20}
        step={1}
        value={toLead}
        onChange={setToLead}
      />
      <Range
        label="Contacts qui achètent"
        shown={`${toCustomer} %`}
        ariaLabel="Taux de conversion en pourcentage"
        min={5}
        max={50}
        step={5}
        value={toCustomer}
        onChange={setToCustomer}
      />
    </Scene>
  );
}

export function PricingScene() {
  const [cost, setCost] = useState(60);
  const [margin, setMargin] = useState(40);
  const [exempt, setExempt] = useState(false);
  const result = priceFromCost(cost, margin / 100, 0.2, exempt);
  const decimal = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
  return (
    <Scene
      label="Construire un prix du coût de revient au prix TTC"
      eyebrow="DU COÛT AU PRIX"
      title="Le prix couvre le coût, la marge, puis la TVA."
      fiction="TVA à 20 % · fictif"
      number={decimal.format(result.includingVat)}
      caption={
        exempt
          ? "prix payé par le client (sans TVA)"
          : "prix TTC payé par le client"
      }
      detail={
        <>
          Prix HT <strong>{decimal.format(result.excludingVat)}</strong>, dont{" "}
          {decimal.format(result.margin)} de marge.{" "}
          {exempt
            ? "En franchise en base, pas de TVA : mention « TVA non applicable, article 293 B du CGI »."
            : `TVA collectée : ${decimal.format(result.vat)}, reversée à l’État.`}
        </>
      }
      takeaway={
        <>
          Un taux de marge de 40 % se calcule sur le prix de vente, pas sur le
          coût.{" "}
          <strong>
            Le client compare le prix à la valeur perçue, pas à votre coût.
          </strong>
        </>
      }
    >
      <Choices
        label="TVA"
        value={exempt ? "franchise" : "tva"}
        onChange={(value) => setExempt(value === "franchise")}
        options={[
          { value: "tva", label: "TVA 20 %" },
          { value: "franchise", label: "Franchise en base" },
        ]}
      />
      <Range
        label="Coût de revient unitaire"
        shown={euros.format(cost)}
        ariaLabel="Coût de revient en euros"
        min={5}
        max={200}
        step={5}
        value={cost}
        onChange={setCost}
      />
      <Range
        label="Taux de marge sur le prix de vente"
        shown={`${margin} %`}
        ariaLabel="Taux de marge en pourcentage"
        min={10}
        max={80}
        step={5}
        value={margin}
        onChange={setMargin}
      />
    </Scene>
  );
}

export function FinancingPlanScene() {
  const [loan, setLoan] = useState(20_000);
  const [equity, setEquity] = useState(6_000);
  const result = financingPlan({
    investments: 20_000,
    workingCapital: 8_000,
    cashCushion: 2_000,
    equity,
    loan,
    grant: 2_000,
  });
  return (
    <Scene
      label="Équilibrer un plan de financement"
      eyebrow="BESOINS CONTRE RESSOURCES"
      title="Un plan de financement doit tomber juste."
      fiction="Besoins : 30 000 € · fictif"
      number={`${result.gap >= 0 ? "+" : "−"}${euros.format(Math.abs(result.gap))}`}
      caption={
        result.gap >= 0
          ? "de marge : le plan est financé"
          : "à trouver : le plan n’est pas financé"
      }
      detail={
        <>
          Besoins : 20 000 € d’investissements, 8 000 € de BFR, 2 000 € de
          trésorerie de départ. Ressources :{" "}
          <strong>{euros.format(result.resources)}</strong>, dont 2 000 €
          d’aide.
        </>
      }
      reading={
        <>
          <strong>Apport personnel :</strong> {percent(result.equityShare)} des
          besoins. Les banques attendent souvent un apport significatif avant de
          prêter.
        </>
      }
      takeaway={
        <>
          Oublier le BFR est l’erreur la plus fréquente d’un premier plan.{" "}
          <strong>
            Une dette se rembourse ; des fonds propres se partagent.
          </strong>
        </>
      }
    >
      <CompareBars
        rows={[
          {
            label: "Besoins",
            amount: result.needs,
            display: euros.format(result.needs),
            className: "is-soft",
          },
          {
            label: "Ressources",
            amount: result.resources,
            display: euros.format(result.resources),
            className: "is-silver",
          },
        ]}
      />
      <Range
        label="Apport personnel"
        shown={euros.format(equity)}
        ariaLabel="Apport personnel en euros"
        min={0}
        max={20_000}
        step={1_000}
        value={equity}
        onChange={setEquity}
      />
      <Range
        label="Prêt bancaire"
        shown={euros.format(loan)}
        ariaLabel="Prêt bancaire en euros"
        min={0}
        max={30_000}
        step={1_000}
        value={loan}
        onChange={setLoan}
      />
    </Scene>
  );
}

/* ---------- Finance d'entreprise ---------- */

export function PaybackScene() {
  const [years, setYears] = useState(5);
  const [gain, setGain] = useState(5_000);
  const result = investmentPayback(15_000, years, gain);
  return (
    <Scene
      label="Amortir un investissement et mesurer son retour"
      eyebrow="UN ACHAT QUI DURE"
      title="L’achat se paie une fois, la charge se répartit."
      fiction="Machine à 15 000 € · fictif"
      number={
        result.paybackYears === null
          ? "—"
          : `${result.paybackYears.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} ans`
      }
      caption="pour récupérer la somme investie"
      detail={
        <>
          Amortissement linéaire :{" "}
          <strong>{euros.format(result.depreciation)}</strong> de charge par an
          pendant {years} ans. Effet sur le résultat annuel :{" "}
          <strong>
            {result.yearlyResult >= 0 ? "+" : "−"}
            {euros.format(Math.abs(result.yearlyResult))}
          </strong>
          .
        </>
      }
      reading={
        <>
          <strong>Retour sur investissement :</strong>{" "}
          {percent(result.returnOnInvestment)} sur la durée d’amortissement. La
          trésorerie, elle, sort en une fois le jour de l’achat.
        </>
      }
      takeaway={
        <>
          Durées d’amortissement indicatives : elles dépendent du bien et des
          règles comptables.{" "}
          <strong>
            Résultat et trésorerie ne racontent pas la même chose.
          </strong>
        </>
      }
    >
      <Range
        label="Durée d’amortissement"
        shown={`${years} ans`}
        ariaLabel="Durée d’amortissement en années"
        min={3}
        max={10}
        step={1}
        value={years}
        onChange={setYears}
      />
      <Range
        label="Gain annuel apporté par la machine"
        shown={euros.format(gain)}
        ariaLabel="Gain annuel en euros"
        min={1_000}
        max={10_000}
        step={500}
        value={gain}
        onChange={setGain}
      />
    </Scene>
  );
}

export function DashboardScene() {
  const [revenue, setRevenue] = useState(200_000);
  const [debt, setDebt] = useState(30_000);
  const result = dashboardRatios({
    revenue,
    grossMarginRate: 0.5,
    fixedCosts: 80_000,
    debt,
    equity: 60_000,
  });
  return (
    <Scene
      label="Lire trois indicateurs de pilotage"
      eyebrow="TROIS CHIFFRES CHAQUE MOIS"
      title="Un tableau de bord tient en trois lignes."
      fiction="Marge brute 50 % · charges fixes 80 000 € · fictif"
      number={`${result.result >= 0 ? "+" : "−"}${euros.format(Math.abs(result.result))}`}
      caption="de résultat sur l’année"
      detail={
        <>
          Taux de rentabilité :{" "}
          <strong>{percent(result.netMarginRate, 1)}</strong> du chiffre
          d’affaires. Endettement :{" "}
          <strong>
            {result.debtRatio === null
              ? "—"
              : `${result.debtRatio.toLocaleString("fr-FR", { maximumFractionDigits: 2 })}`}
          </strong>{" "}
          (dettes ÷ capitaux propres de 60 000 €).
        </>
      }
      reading={
        result.alerts.loss || result.alerts.heavyDebt ? (
          <>
            <strong>À surveiller :</strong>{" "}
            {result.alerts.loss ? "l’activité perd de l’argent. " : ""}
            {result.alerts.heavyDebt
              ? "les dettes dépassent les capitaux propres : la marge de manœuvre se réduit."
              : ""}
          </>
        ) : (
          <>
            <strong>Rien d’alarmant :</strong> activité rentable et endettement
            modéré.
          </>
        )
      }
      takeaway={
        <>
          Choisissez peu d’indicateurs, suivez-les chaque mois, et décidez d’une
          action quand l’un d’eux dérive.{" "}
          <strong>Un indicateur sans décision associée est du bruit.</strong>
        </>
      }
    >
      <Range
        label="Chiffre d’affaires annuel"
        shown={euros.format(revenue)}
        ariaLabel="Chiffre d’affaires en euros"
        min={80_000}
        max={300_000}
        step={10_000}
        value={revenue}
        onChange={setRevenue}
      />
      <Range
        label="Dettes financières"
        shown={euros.format(debt)}
        ariaLabel="Dettes en euros"
        min={0}
        max={150_000}
        step={5_000}
        value={debt}
        onChange={setDebt}
      />
    </Scene>
  );
}

/* ---------- Jeux de tri ---------- */

function makeGame(
  config: Omit<Parameters<typeof SortingGame>[0], "items"> & {
    items: SortingItem[];
  },
) {
  return function Game() {
    return <SortingGame {...config} />;
  };
}

const allRight = "bien classés.";

export const MarketsGame = makeGame({
  label: "Distinguer une action d’une obligation",
  eyebrow: "À VOUS DE CLASSER",
  title: "Action ou obligation ?",
  fiction: "Six affirmations",
  yes: "Action",
  no: "Obligation",
  summary: () =>
    `${allRight} Une action est une part du capital ; une obligation, une part de dette.`,
  takeaway: (
    <>
      L’actionnaire partage les risques et les bénéfices ; le créancier attend
      un coupon et son remboursement.{" "}
      <strong>Les deux peuvent perdre de la valeur.</strong>
    </>
  ),
  items: [
    {
      id: "capital",
      text: "Donne une part du capital et un droit de vote.",
      answer: true,
      why: "C’est la définition d’une action.",
    },
    {
      id: "coupon",
      text: "Verse un coupon fixé à l’émission, puis rembourse le nominal.",
      answer: false,
      why: "C’est une obligation : un prêt rémunéré.",
    },
    {
      id: "dividende",
      text: "Peut verser un dividende, s’il est décidé.",
      answer: true,
      why: "Le dividende n’est jamais garanti.",
    },
    {
      id: "faillite",
      text: "En cas de faillite, est remboursée avant les actionnaires.",
      answer: false,
      why: "Les créanciers passent avant les actionnaires.",
    },
    {
      id: "benefices",
      text: "Sa valeur dépend des bénéfices futurs espérés.",
      answer: true,
      why: "Le cours d’une action anticipe les résultats.",
    },
    {
      id: "taux",
      text: "Son prix baisse quand les taux d’intérêt montent.",
      answer: false,
      why: "Le coupon fixe devient moins attractif.",
    },
  ],
});

export const BiasGame = makeGame({
  label: "Repérer les biais dans des décisions d’investissement",
  eyebrow: "À VOUS DE TRIER",
  title: "Biais, ou décision raisonnée ?",
  fiction: "Six décisions fictives",
  yes: "Biais",
  no: "Décision raisonnée",
  summary: (score) =>
    score.seriousMisses
      ? `${allRight} Relisez les deux biais les plus coûteux : ceux qui font vendre ou garder sous le coup de l’émotion.`
      : `${allRight} Une règle écrite à l’avance protège de ces réflexes.`,
  takeaway: (
    <>
      Un ordre à cours limité fixe un prix maximal à l’achat, un ordre au marché
      s’exécute au prix disponible.{" "}
      <strong>
        La plupart des erreurs viennent du moment, pas du choix du titre.
      </strong>
    </>
  ),
  items: [
    {
      id: "mode",
      text: "J’achète parce que tout le monde en parle cette semaine.",
      answer: true,
      why: "Mimétisme : la popularité n’est pas une analyse.",
    },
    {
      id: "perte",
      text: "Je garde une action en perte pour ne pas « acter » la perte.",
      answer: true,
      serious: true,
      why: "Aversion aux pertes : la perte existe déjà.",
    },
    {
      id: "limite",
      text: "Je passe un ordre à cours limité pour ne pas payer plus qu’un prix décidé.",
      answer: false,
      why: "Une décision fixée à l’avance.",
    },
    {
      id: "regulier",
      text: "J’investis le même montant chaque mois, quel que soit le marché.",
      answer: false,
      why: "L’investissement programmé évite de deviner le bon moment.",
    },
    {
      id: "panique",
      text: "Je vends tout après une baisse de 10 % en une journée.",
      answer: true,
      serious: true,
      why: "Réaction à chaud : on vend souvent au plus bas.",
    },
    {
      id: "cible",
      text: "Je relis mon allocation cible avant d’acheter.",
      answer: false,
      why: "Revenir au plan, c’est l’inverse d’un biais.",
    },
  ],
});

export const CreationStepsGame = makeGame({
  label: "Ordonner les étapes d’une création d’entreprise",
  eyebrow: "DANS QUEL ORDRE ?",
  title: "Avant ou après l’immatriculation ?",
  fiction: "Six étapes",
  yes: "Avant",
  no: "Après",
  summary: () =>
    `${allRight} Valider le marché et choisir le statut viennent toujours en premier.`,
  takeaway: (
    <>
      Les formalités se font en ligne sur le guichet unique de l’INPI.{" "}
      <strong>
        L’immatriculation n’est pas le début : c’est l’aboutissement d’une
        préparation.
      </strong>
    </>
  ),
  items: [
    {
      id: "clients",
      text: "Vérifier que des clients sont prêts à payer.",
      answer: true,
      why: "L’étude de marché précède toute démarche.",
    },
    {
      id: "statut",
      text: "Choisir le statut juridique.",
      answer: true,
      why: "Le dossier d’immatriculation en dépend.",
    },
    {
      id: "capital",
      text: "Déposer le capital d’une société sur un compte bloqué.",
      answer: true,
      why: "L’attestation de dépôt fait partie du dossier.",
    },
    {
      id: "siren",
      text: "Recevoir son numéro SIREN.",
      answer: false,
      why: "Il est attribué à l’immatriculation.",
    },
    {
      id: "urssaf",
      text: "Déclarer son chiffre d’affaires à l’Urssaf.",
      answer: false,
      why: "Il faut d’abord exister et encaisser.",
    },
    {
      id: "facture",
      text: "Émettre sa première facture avec le numéro SIREN.",
      answer: false,
      why: "Le SIREN figure sur la facture.",
    },
  ],
});

export const InvoiceGame = makeGame({
  label: "Reconnaître les mentions obligatoires d’une facture",
  eyebrow: "FACTURE CONFORME",
  title: "Obligatoire ou facultatif ?",
  fiction: "Facture entre professionnels",
  yes: "Obligatoire",
  no: "Facultatif",
  summary: () =>
    `${allRight} Une mention manquante expose à une amende et retarde le paiement.`,
  takeaway: (
    <>
      Liste non exhaustive (SIREN, adresses, désignation, date de livraison…), à
      vérifier sur entreprendre.service-public.gouv.fr.{" "}
      <strong>
        Un logiciel de facturation conforme numérote et protège les factures
        émises.
      </strong>
    </>
  ),
  items: [
    {
      id: "numero",
      text: "Un numéro de facture unique, chronologique.",
      answer: true,
      why: "Les factures se suivent sans trou ni doublon.",
    },
    {
      id: "echeance",
      text: "La date d’échéance du paiement.",
      answer: true,
      why: "Elle fixe le point de départ des pénalités.",
    },
    {
      id: "logo",
      text: "Le logo de l’entreprise.",
      answer: false,
      why: "Utile, jamais obligatoire.",
    },
    {
      id: "tva",
      text: "Prix HT, taux et montant de TVA, total TTC, ou la mention d’exonération.",
      answer: true,
      why: "La TVA doit être lisible ou son absence justifiée.",
    },
    {
      id: "penalites",
      text: "Les pénalités de retard et l’indemnité forfaitaire de 40 € pour frais de recouvrement.",
      answer: true,
      why: "Obligatoires entre professionnels.",
    },
    {
      id: "merci",
      text: "Un message de remerciement.",
      answer: false,
      why: "Aimable, mais sans valeur légale.",
    },
  ],
});

export const BankFraudGame = makeGame({
  label: "Distinguer une fraude d’un message bancaire normal",
  eyebrow: "À VOUS DE TRIER",
  title: "Fraude probable, ou message normal ?",
  fiction: "Messages fictifs",
  yes: "Fraude probable",
  no: "Message normal",
  summary: (score) =>
    score.seriousMisses
      ? `${allRight} Attention aux deux plus dangereuses : le faux conseiller et le faux proche.`
      : `${allRight} Le réflexe : raccrocher et rappeler soi-même le numéro officiel.`,
  takeaway: (
    <>
      Votre banque ne vous demande jamais de valider une opération pour
      l’annuler, ni vos codes.{" "}
      <strong>
        En cas de doute, faites opposition et appelez le numéro au dos de la
        carte.
      </strong>
    </>
  ),
  items: [
    {
      id: "colis",
      text: "SMS : « Votre colis est bloqué, payez 1,99 € via ce lien. »",
      answer: true,
      why: "Hameçonnage classique : le petit montant sert à voler la carte.",
    },
    {
      id: "conseiller",
      text: "Un « conseiller » appelle et demande de valider une opération pour l’annuler.",
      answer: true,
      serious: true,
      why: "C’est exactement ainsi que le fraudeur fait valider son paiement.",
    },
    {
      id: "appli",
      text: "Votre application demande de confirmer un paiement que vous venez de faire.",
      answer: false,
      why: "Authentification forte normale, à votre initiative.",
    },
    {
      id: "impots",
      text: "E-mail des impôts : « Remboursement en attente, saisissez votre carte. »",
      answer: true,
      why: "L’administration ne demande pas de numéro de carte par e-mail.",
    },
    {
      id: "releve",
      text: "Relevé mensuel disponible dans l’espace client, sans lien ni pièce jointe.",
      answer: false,
      why: "Simple notification.",
    },
    {
      id: "proche",
      text: "Un « ami » écrit depuis un nouveau numéro et demande un virement urgent.",
      answer: true,
      serious: true,
      why: "Arnaque au faux proche : appelez-le sur son numéro habituel.",
    },
  ],
});

export const InsuranceGame = makeGame({
  label: "Distinguer les assurances obligatoires des facultatives",
  eyebrow: "CE QUE LA LOI IMPOSE",
  title: "Obligatoire ou facultative ?",
  fiction: "Particuliers et artisans, en France",
  yes: "Obligatoire",
  no: "Facultative",
  summary: () =>
    `${allRight} Facultative ne veut pas dire inutile : c’est le risque couvert qui décide.`,
  takeaway: (
    <>
      Avant de signer : garanties, franchise (ce qui reste à votre charge) et
      exclusions.{" "}
      <strong>
        Comparez le prix à ce que vous ne pourriez pas payer seul.
      </strong>
    </>
  ),
  items: [
    {
      id: "auto",
      text: "La responsabilité civile d’une voiture qui circule.",
      answer: true,
      why: "Obligatoire pour tout véhicule terrestre à moteur.",
    },
    {
      id: "locataire",
      text: "L’assurance habitation d’un locataire.",
      answer: true,
      why: "Le locataire doit s’assurer contre les risques locatifs.",
    },
    {
      id: "maison",
      text: "L’assurance d’une maison individuelle habitée par son propriétaire.",
      answer: false,
      why: "Facultative, mais vivement conseillée.",
    },
    {
      id: "gav",
      text: "La garantie des accidents de la vie.",
      answer: false,
      why: "Facultative : elle couvre les accidents domestiques.",
    },
    {
      id: "telephone",
      text: "L’assurance d’un smartphone.",
      answer: false,
      why: "Facultative, souvent redondante avec d’autres garanties.",
    },
    {
      id: "decennale",
      text: "La responsabilité civile décennale d’un artisan du bâtiment.",
      answer: true,
      why: "Obligatoire pour les travaux de construction.",
    },
  ],
});

export const AiDataGame = makeGame({
  label: "Décider ce qu’on peut confier à un outil d’IA grand public",
  eyebrow: "AVANT DE COLLER",
  title: "Je peux le coller, ou pas ?",
  fiction: "Outil grand public, sans contrat entreprise",
  yes: "Je peux le coller",
  no: "Je ne le colle pas",
  summary: (score) =>
    score.seriousMisses
      ? `${allRight} Données personnelles, santé et secrets ne sortent jamais vers un outil non maîtrisé.`
      : `${allRight} Minimiser : ne donner que ce qui est nécessaire, anonymisé.`,
  takeaway: (
    <>
      Le RGPD impose de ne traiter que les données nécessaires ; un contrat
      d’entreprise peut changer les règles de conservation.{" "}
      <strong>Dans le doute, anonymisez ou ne collez pas.</strong>
    </>
  ),
  items: [
    {
      id: "public",
      text: "Le texte public de présentation de mon entreprise.",
      answer: true,
      why: "Information déjà publique.",
    },
    {
      id: "clients",
      text: "La liste de mes clients avec e-mails et téléphones.",
      answer: false,
      serious: true,
      why: "Données personnelles de tiers.",
    },
    {
      id: "sante",
      text: "Le compte rendu médical d’un salarié.",
      answer: false,
      serious: true,
      why: "Donnée de santé : catégorie particulièrement protégée.",
    },
    {
      id: "anonyme",
      text: "Un e-mail anonymisé, sans noms ni coordonnées, pour en améliorer le ton.",
      answer: true,
      why: "Plus rien ne permet d’identifier quelqu’un.",
    },
    {
      id: "mdp",
      text: "Le mot de passe du logiciel de facturation.",
      answer: false,
      serious: true,
      why: "Un secret ne se partage avec aucun outil.",
    },
    {
      id: "code",
      text: "Le code source d’un produit non publié, sous accord de confidentialité.",
      answer: false,
      why: "Secret d’affaires et engagement contractuel.",
    },
  ],
});

export const AiUseCaseGame = makeGame({
  label: "Choisir un bon cas d’usage pour un premier projet IA",
  eyebrow: "UN PREMIER PILOTE",
  title: "Bon pilote, ou mauvaise idée ?",
  fiction: "Six idées fictives",
  yes: "Bon pilote",
  no: "Mauvaise idée",
  summary: (score) =>
    score.seriousMisses
      ? `${allRight} Une décision qui engage une personne ne se délègue pas à l’IA sans contrôle humain.`
      : `${allRight} Fréquent, vérifiable, à faible risque : c’est le bon profil.`,
  takeaway: (
    <>
      Gain net = temps gagné − temps de vérification − coût de l’outil.{" "}
      <strong>
        Un pilote se mesure sur quelques semaines avant d’être étendu.
      </strong>
    </>
  ),
  items: [
    {
      id: "faq",
      text: "Rédiger des brouillons de réponses aux questions fréquentes, relus avant envoi.",
      answer: true,
      why: "Tâche répétitive, relue, à faible risque.",
    },
    {
      id: "credit",
      text: "Décider seul de refuser un crédit à un client.",
      answer: false,
      serious: true,
      why: "Décision à fort impact : contrôle humain indispensable.",
    },
    {
      id: "cr",
      text: "Résumer des comptes rendus de réunion internes.",
      answer: true,
      why: "Gain fréquent, erreurs faciles à repérer.",
    },
    {
      id: "paie",
      text: "Calculer la paie sans aucune vérification.",
      answer: false,
      serious: true,
      why: "Une erreur coûte cher et engage l’employeur.",
    },
    {
      id: "annuel",
      text: "Automatiser une tâche faite une fois par an.",
      answer: false,
      why: "Le gain ne couvrira pas la mise en place.",
    },
    {
      id: "tri",
      text: "Classer les e-mails entrants par sujet, avec contrôle d’un échantillon.",
      answer: true,
      why: "Volume élevé et vérification simple.",
    },
  ],
});

export const AiActGame = makeGame({
  label: "Classer des usages selon les risques de l’AI Act",
  eyebrow: "L’APPROCHE PAR LES RISQUES",
  title: "Interdit ou à haut risque, ou risque limité ?",
  fiction: "Règlement européen sur l’IA",
  yes: "Interdit ou haut risque",
  no: "Risque limité ou minimal",
  summary: () =>
    `${allRight} Plus l’usage touche aux droits des personnes, plus les obligations sont lourdes.`,
  takeaway: (
    <>
      Les pratiques interdites s’appliquent depuis février 2025 ; le calendrier
      des systèmes à haut risque a été décalé (à vérifier selon les textes en
      vigueur).{" "}
      <strong>Un chatbot doit au minimum dire qu’il est une IA.</strong>
    </>
  ),
  items: [
    {
      id: "notation",
      text: "La notation sociale des citoyens par une autorité publique.",
      answer: true,
      serious: true,
      why: "Pratique interdite.",
    },
    {
      id: "cv",
      text: "Le tri automatique des CV pour un recrutement.",
      answer: true,
      why: "Système à haut risque : emploi.",
    },
    {
      id: "chatbot",
      text: "Un chatbot de service client.",
      answer: false,
      why: "Risque limité : obligation de transparence.",
    },
    {
      id: "spam",
      text: "Un filtre anti-spam.",
      answer: false,
      why: "Risque minimal.",
    },
    {
      id: "emotions",
      text: "La reconnaissance des émotions des salariés au travail.",
      answer: true,
      serious: true,
      why: "Pratique interdite, sauf raisons médicales ou de sécurité.",
    },
    {
      id: "films",
      text: "La recommandation de films sur une plateforme.",
      answer: false,
      why: "Risque minimal.",
    },
  ],
});
