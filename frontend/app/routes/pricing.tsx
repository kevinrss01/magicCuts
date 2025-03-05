import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";

export default function Pricing() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const features = [
    {
      name: "Monthly price",
      basic: "€10",
      pro: "€20",
      premium: "€30",
    },
    {
      name: "Cost per video",
      basic: "€1.00",
      pro: "€0.80",
      premium: "€0.75",
    },
    {
      name: "Cost per short",
      basic: "€0.10",
      pro: "€0.08",
      premium: "€0.075",
    },
    {
      name: "Upload video size",
      basic: "Up to 1GB",
      pro: "Up to 1GB",
      premium: "Up to 1GB",
    },
    {
      name: "Video resolution",
      basic: "Up to 4K",
      pro: "Up to 4K",
      premium: "Up to 4K",
    },
    {
      name: "Video length",
      basic: "Unlimited",
      pro: "Unlimited",
      premium: "Unlimited",
    },
    { name: "AI-powered short creation", basic: "✓", pro: "✓", premium: "✓" },
    { name: "Shorts per video", basic: "10", pro: "10", premium: "10" },
  ];

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-default-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <h1 className="text-4xl font-bold mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-default-600 max-w-2xl mx-auto">
            Transform your long videos into viral short content with our
            AI-powered platform. Choose the plan that works for you.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col md:flex-row justify-center gap-10 mb-24">
          <Card className="border border-default-200 w-full md:w-1/3 max-w-md mx-auto">
            <CardHeader className="flex flex-col gap-3 pb-6">
              <h2 className="text-xl font-bold">Basic</h2>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold">€10</span>
                <span className="text-default-500 mb-1">/month</span>
              </div>
              <p className="text-default-500">Perfect for getting started</p>
            </CardHeader>
            <Divider />
            <CardBody className="pt-6">
              <div className="flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon="lucide:film" className="text-primary" />
                    <span className="font-medium">10 Videos</span>
                  </div>
                  <p className="text-default-500 text-sm">
                    Upload up to 10 videos per month
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon="lucide:scissors" className="text-primary" />
                    <span className="font-medium">100 Shorts</span>
                  </div>
                  <p className="text-default-500 text-sm">
                    Create up to 100 short clips (10 per video)
                  </p>
                </div>
                <Button
                  color="primary"
                  size="lg"
                  className="w-full mt-4"
                  onPress={() => setIsModalOpen(true)}
                >
                  Get Started
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-primary shadow-lg w-full md:w-1/3 max-w-md mx-auto overflow-hidden">
            <div className="bg-primary text-white py-1.5 px-0 text-center font-medium text-sm">
              MOST POPULAR
            </div>
            <CardHeader className="flex flex-col gap-3 pb-6 pt-4">
              <h2 className="text-xl font-bold">Pro</h2>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold">€20</span>
                <span className="text-default-500 mb-1">/month</span>
              </div>
              <p className="text-default-500">
                Best value for content creators
              </p>
            </CardHeader>
            <Divider />
            <CardBody className="pt-6">
              <div className="flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon="lucide:film" className="text-primary" />
                    <span className="font-medium">25 Videos</span>
                  </div>
                  <p className="text-default-500 text-sm">
                    Upload up to 25 videos per month
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon="lucide:scissors" className="text-primary" />
                    <span className="font-medium">250 Shorts</span>
                  </div>
                  <p className="text-default-500 text-sm">
                    Create up to 250 short clips (10 per video)
                  </p>
                </div>
                <Button
                  color="primary"
                  size="lg"
                  className="w-full mt-4"
                  onPress={() => setIsModalOpen(true)}
                >
                  Get Started
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Premium Plan */}
          <Card className="border border-default-200 w-full md:w-1/3 max-w-md mx-auto">
            <CardHeader className="flex flex-col gap-3 pb-6">
              <h2 className="text-xl font-bold">Premium</h2>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold">€30</span>
                <span className="text-default-500 mb-1">/month</span>
              </div>
              <p className="text-default-500">For serious content creators</p>
            </CardHeader>
            <Divider />
            <CardBody className="pt-6">
              <div className="flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon="lucide:film" className="text-primary" />
                    <span className="font-medium">40 Videos</span>
                  </div>
                  <p className="text-default-500 text-sm">
                    Upload up to 40 videos per month
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon="lucide:scissors" className="text-primary" />
                    <span className="font-medium">400 Shorts</span>
                  </div>
                  <p className="text-default-500 text-sm">
                    Create up to 400 short clips (10 per video)
                  </p>
                </div>
                <Button
                  color="primary"
                  size="lg"
                  className="w-full mt-4"
                  onPress={() => setIsModalOpen(true)}
                >
                  Get Started
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="bg-content1 rounded-xl p-8 shadow-md mb-24">
          <h2 className="text-2xl font-bold mb-8 text-center">Compare Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-default-200">
                  <th className="text-left py-4 px-6 font-medium">Features</th>
                  <th className="text-center py-4 px-6 font-medium">Basic</th>
                  <th className="text-center py-4 px-6 font-medium">Pro</th>
                  <th className="text-center py-4 px-6 font-medium">Premium</th>
                </tr>
              </thead>
              <tbody>
                {features.slice(0, 3).map((feature, index) => (
                  <tr
                    key={index}
                    className={
                      index === 0
                        ? "bg-default-50 font-semibold"
                        : "bg-default-100"
                    }
                  >
                    <td className="py-4 px-6">{feature.name}</td>
                    <td className="text-center py-4 px-6">{feature.basic}</td>
                    <td className="text-center py-4 px-6">{feature.pro}</td>
                    <td className="text-center py-4 px-6">{feature.premium}</td>
                  </tr>
                ))}
                <tr className="border-b border-default-200">
                  <td colSpan={4} className="py-2"></td>
                </tr>
                {features.slice(3).map((feature, index) => (
                  <tr
                    key={index + 3}
                    className={index % 2 === 0 ? "bg-default-50" : ""}
                  >
                    <td className="py-4 px-6">{feature.name}</td>
                    <td className="text-center py-4 px-6">
                      {feature.basic === "✓" ? (
                        <Icon
                          icon="lucide:check"
                          className="text-success mx-auto"
                        />
                      ) : feature.basic === "✗" ? (
                        <Icon icon="lucide:x" className="text-danger mx-auto" />
                      ) : (
                        feature.basic
                      )}
                    </td>
                    <td className="text-center py-4 px-6">
                      {feature.pro === "✓" ? (
                        <Icon
                          icon="lucide:check"
                          className="text-success mx-auto"
                        />
                      ) : feature.pro === "✗" ? (
                        <Icon icon="lucide:x" className="text-danger mx-auto" />
                      ) : (
                        feature.pro
                      )}
                    </td>
                    <td className="text-center py-4 px-6">
                      {feature.premium === "✓" ? (
                        <Icon
                          icon="lucide:check"
                          className="text-success mx-auto"
                        />
                      ) : feature.premium === "✗" ? (
                        <Icon icon="lucide:x" className="text-danger mx-auto" />
                      ) : (
                        feature.premium
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 mb-24">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-sm">
              <CardBody className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  What happens if I exceed my video limit?
                </h3>
                <p className="text-default-600">
                  If you reach your monthly video limit, you can upgrade to a
                  higher plan or wait until the next billing cycle.
                </p>
              </CardBody>
            </Card>
            <Card className="shadow-sm">
              <CardBody className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-default-600">
                  Yes, you can cancel your subscription at any time. You'll
                  continue to have access until the end of your billing period.
                </p>
              </CardBody>
            </Card>
            <Card className="shadow-sm">
              <CardBody className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  How does the AI create short clips?
                </h3>
                <p className="text-default-600">
                  Our AI analyzes your videos for engaging moments, transitions,
                  and key points to create the most shareable short-form
                  content.
                </p>
              </CardBody>
            </Card>
            <Card className="shadow-sm">
              <CardBody className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  What video formats are supported?
                </h3>
                <p className="text-default-600">
                  We support most common video formats including MP4, MOV, AVI,
                  and more. Videos can be up to 1GB in size.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center pb-12">
          <h2 className="text-3xl font-bold mb-6">
            Ready to transform your content?
          </h2>
          <p className="text-default-600 mb-8 max-w-2xl mx-auto">
            Join thousands of content creators who are already using our
            platform to increase their reach and engagement.
          </p>
          <Button
            color="primary"
            size="lg"
            onPress={() => {
              navigate("/dashboard");
            }}
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>

      {/* Not Available Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Payment Not Available
          </ModalHeader>
          <ModalBody>
            <p>
              Payment options are not available at the moment. Send us a message
              if you need to pay for a subscription.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={() => setIsModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
