import { branding } from '../config/branding'

export const Footer = () => {
  const CURRENT_YEAR = new Date().getFullYear()

  return (
    <footer className="bg-gray-700 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/* Logo/Icon */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="/SpendWise-Logo.png"
                  alt={branding.appName}
                  className="w-70 h-full object-contain"
                />
              </div>
              <span className="font-bold text-white">{branding.appName}</span>
            </div>
            <p className="text-sm text-gray-400">{branding.description}</p>
          </div>

          {/* Contact */}
          <div className="text-right">
            <h4 className="font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={`mailto:${branding.supportEmail}`} className="hover:text-blue-400">
                  Email: {branding.supportEmail}
                </a>
              </li>
              <li>
                <a href={branding.github} className="hover:text-blue-400">
                  Github: github.com/bcesano20
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-800" />

        {/* Bottom */}
        <div className="pt-8 flex justify-between items-center text-sm text-gray-400">
          <p>
            &copy; {CURRENT_YEAR} {branding.appName}. Todos los derechos reservados.
          </p>
          <p> Desarrollado por Bruno Cesano</p>
        </div>
      </div>
    </footer>
  )
}
