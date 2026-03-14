import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { record, old_record } = await req.json();

    // Only trigger on status change
    if (record.status === old_record?.status) {
      return new Response(JSON.stringify({ message: "No status change" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const { id, customer_name, email, status, items, total } = record;

    if (!email) {
      return new Response(JSON.stringify({ message: "No email provided in order" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    let subject = "";
    let htmlContent = "";

    const formattedTotal = new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
    }).format(total);

    let itemsHtml = "";
    if (items && Array.isArray(items)) {
      itemsHtml = items.map((item: any) => {
        let shadeHtml = "";
        if (item.selectedShade) {
          shadeHtml = `<br/><span style="font-size: 11px; color: #888;">Shade: ${item.selectedShade.name}</span>`;
        }
        return `
          <div style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <strong style="color: #001f3f;">${item.name}</strong><br/>
            <span style="font-size: 12px; color: #666;">Size: ${item.size} | Qty: ${item.quantity}</span>
            ${shadeHtml}
          </div>
        `;
      }).join("");
    } else {
      itemsHtml = "<p>No items found</p>";
    }

    const orderNo = id.substring(0, 8);

    if (status === "confirmed") {
      subject = "Order Confirmed - #" + orderNo;
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h1 style="color: #001f3f; text-align: center;">Order Confirmed!</h1>
          <p>Hi <strong>${customer_name}</strong>,</p>
          <p>Great news! Your order <strong>#${orderNo}</strong> has been confirmed and is being prepared for dispatch.</p>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #001f3f;">Order Summary</h3>
            ${itemsHtml}
            <div style="margin-top: 20px; font-weight: bold; font-size: 18px; color: #d4af37;">
              Total: ${formattedTotal}
            </div>
          </div>
          <p style="text-align: center; color: #666; font-size: 12px;">
            Thank you for choosing Tawakkal Paint House!<br/>
            Contact us: +92 347 5658761
          </p>
        </div>
      `;
    } else if (status === "shipped") {
      subject = "Your Order is on the Way! - #" + orderNo;
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h1 style="color: #001f3f; text-align: center;">Order Shipped!</h1>
          <p>Hi <strong>${customer_name}</strong>,</p>
          <p>Your order <strong>#${orderNo}</strong> has been shipped and is heading your way!</p>
          <p>Our delivery partner will contact you soon for the delivery.</p>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #001f3f;">Shipping Details</h3>
             <p><strong>Address:</strong><br/>${record.delivery_address}<br/>${record.delivery_area}</p>
          </div>
          <p style="text-align: center; color: #666; font-size: 12px;">
            Thank you for choosing Tawakkal Paint House!<br/>
            Contact us: +92 347 5658761
          </p>
        </div>
      `;
    } else if (status === "delivered") {
      subject = "Order Delivered - #" + orderNo;
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h1 style="color: #001f3f; text-align: center;">Order Delivered!</h1>
          <p>Hi <strong>${customer_name}</strong>,</p>
          <p>Your order <strong>#${orderNo}</strong> has been successfully delivered. We hope you love your new paint!</p>
          <div style="text-align: center; margin: 30px 0;">
             <a href="https://tawakkal-paint-house.vercel.app/" style="background: #001f3f; color: #fff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">Visit Our Website</a>
          </div>
          <p style="text-align: center; color: #666; font-size: 12px;">
            Thank you for choosing Tawakkal Paint House!<br/>
            Contact us: +92 347 5658761
          </p>
        </div>
      `;
    }

    if (!subject || !htmlContent) {
      return new Response(JSON.stringify({ message: "No notification needed for this status" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Tawakkal Paint House <painthtawakkal@gmail.com>",
        to: [email],
        subject: subject,
        html: htmlContent,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
